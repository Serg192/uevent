const HttpStatus = require("http-status-codes").StatusCodes;
const logger = require("../../config/logger");
const paymentService = require("./payment-service");
const s3Service = require("./s3-service");

const User = require("../models/user-model");
const Company = require("../models/company-model");

const createCompany = async (companyData, userId) => {
  const companyEmailUsed = await Company.findOne({ email: companyData.email });
  const userEmailUsed = await User.findOne({ email: companyData.email });

  if (companyEmailUsed || userEmailUsed) {
    throw {
      statusCode: HttpStatus.CONFLICT,
      message: "Email is already used",
    };
  }

  const { name, email, lat, long } = companyData;
  const user = await User.findById(userId);

  const newCompany = new Company({
    name,
    email,
    location: {
      type: "Point",
      coordinates: [lat, long],
    },
    emailVerified: false,
    owner: user._id,
    followers: [],
  });

  return await newCompany.save();
};

const updateCompany = async (companyData, companyId) => {
  const companyEmailUsed = await Company.findOne({ email: companyData.email });
  const userEmailUsed = await User.findOne({ email: companyData.email });

  if (
    userEmailUsed ||
    (companyEmailUsed &&
      companyEmailUsed._id.toString() !== companyId.toString())
  ) {
    throw {
      statusCode: HttpStatus.CONFLICT,
      message: "Email is already used",
    };
  }

  if (companyData.email) companyData.emailVerified = false;

  if (companyData.lat || companyData.long) {
    const { lat, long } = companyData;
    const company = await Company.findById(companyId);
    companyData.location = {
      type: "Point",
      coordinates: [
        lat ? lat : company.location.coordinates[0],
        long ? long : company.location.coordinates[1],
      ],
    };
  }

  return await Company.findByIdAndUpdate({ _id: companyId }, companyData, {
    new: true,
  });
};

const uploadLogo = async (companyId, file) => {
  const company = await Company.findById(companyId);
  const oldLogo = company.logo;

  if (oldLogo) {
    try {
      const logoKey = oldLogo.split("/").pop();
      await s3Service.deleteFile(logoKey);
    } catch (err) {
      logger.error(err.message);
    }
  }

  try {
    const url = await s3Service.uploadFile(file);
    company.logo = url;
    await company.save();
    return url;
  } catch (err) {
    throw {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    };
  }
};

const connectToStripe = async (companyId) => {
  const company = await Company.findById(companyId);

  if (!company.stripeId) {
    const account = await paymentService.createAccount(companyId);
    company.stripeId = account.id;
    await company.save();
  }
  return await paymentService.getOnboardingLink(company.stripeId);
};

const getStripeAccount = async (companyId) => {
  const company = await Company.findById(companyId);

  if (!company.stripeId || !paymentService.isAccountValid(company.stripeId)) {
    throw {
      statusCode: HttpStatus.METHOD_NOT_ALLOWED,
      message: "Stripe account is not set up correctly",
    };
  }
  return await paymentService.createLoginLink(company.stripeId);
};

const getUserCompanies = async (userId) => {
  return await Company.find({ owner: userId }).select("-stripeId");
};

const getFollowedCompanies = async (userId) => {
  return await Company.find({ followers: { $in: [userId] } }).select(
    "-stripeId"
  );
};

const toggleFollowStatus = async (userId, companyId) => {
  const company = await Company.findById(companyId);
  const user = await User.findById(userId);

  if (!company || !user) {
    throw {
      statusCode: HttpStatus.NOT_FOUND,
      message: "User or company was now found",
    };
  }

  const isFollower = company.followers.includes(userId);
  if (isFollower) {
    await Company.findByIdAndUpdate(companyId, {
      $pull: { followers: userId },
    });
    return false;
  } else {
    await Company.findByIdAndUpdate(companyId, {
      $push: { followers: userId },
    });
    return true;
  }
};

module.exports = {
  createCompany,
  updateCompany,
  uploadLogo,
  connectToStripe,
  getStripeAccount,
  getUserCompanies,
  getFollowedCompanies,
  toggleFollowStatus,
};
