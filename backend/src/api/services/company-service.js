const HttpStatus = require("http-status-codes").StatusCodes;
const logger = require("../../config/logger");
const eventService = require("../services/event-service");
const paymentService = require("./payment-service");
const s3Service = require("./s3-service");

const User = require("../models/user-model");
const Company = require("../models/company-model");
const { paginate } = require("../helpers/pagination-helper");

const createCompany = async (companyData, userId) => {
  const companyEmailUsed = await Company.findOne({ email: companyData.email });
  const userEmailUsed = await User.findOne({ email: companyData.email });

  if (companyEmailUsed || userEmailUsed) {
    throw {
      statusCode: HttpStatus.CONFLICT,
      message: "Email is already used",
    };
  }

  const { name, email, lat, long, address } = companyData;
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
    address,
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

const getCompany = async (companyId) => {
  return await Company.findById(companyId).select("-stripeId");
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
  return await paymentService.getOnboardingLink(company.stripeId, companyId);
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

const getUserCompanies = async (pagination, userId) => {
  return await paginate(
    Company,
    pagination,
    { owner: userId },
    null,
    "-stripeId"
  );
};

const getFollowedCompanies = async (pagination, userId) => {
  return await paginate(
    Company,
    pagination,
    { followers: { $in: [userId] } },
    null,
    "-stripeId"
  );
};

const getAll = async (pagination, search) => {
  let filter = null;
  if (search) {
    const regexPattern = new RegExp(`^${search}`, "i");
    filter = { name: { $regex: regexPattern } };
  }
  return await paginate(Company, pagination, filter, null, "-stripeId");
};

const getCompanyEvents = async (pagination, companyId) => {
  return await eventService.getEvents(pagination, { company: companyId });
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
  getCompany,
  uploadLogo,
  connectToStripe,
  getStripeAccount,
  getUserCompanies,
  getFollowedCompanies,
  getAll,
  getCompanyEvents,
  toggleFollowStatus,
};
