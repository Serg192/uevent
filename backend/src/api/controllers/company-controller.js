const HttpStatus = require("http-status-codes").StatusCodes;
const logger = require("../../config/logger");
const companyService = require("../services/company-service");

const createCompany = async (req, res, next) => {
  try {
    const data = await companyService.createCompany(req.body, req.userId);
    return res.status(HttpStatus.CREATED).json({ data });
  } catch (err) {
    next(err);
  }
};

const updateCompany = async (req, res, next) => {
  try {
    const data = await companyService.updateCompany(req.body, req.params.id);
    return res.status(HttpStatus.OK).json({ data });
  } catch (err) {
    next(err);
  }
};

const uploadLogo = async (req, res, next) => {
  try {
    const url = await companyService.uploadLogo(req.params.id, req.file);
    return res.status(HttpStatus.OK).json({ url });
  } catch (err) {
    next(err);
  }
};

const connectToStripe = async (req, res, next) => {
  const url = await companyService.connectToStripe(req.params.id);
  return res.status(HttpStatus.OK).json({ url });
};

const getMyCompanies = async (req, res, next) => {
  const data = await companyService.getUserCompanies(req.userId);
  return res.status(HttpStatus.OK).json({ data });
};

const getFollowedCompanies = async (req, res, next) => {
  const data = await companyService.getFollowedCompanies(req.userId);
  return res.status(HttpStatus.OK).json({ data });
};

const toggleFollowStatus = async (req, res, next) => {
  try {
    const follow = await companyService.toggleFollowStatus(
      req.userId,
      req.params.id
    );
    return res.status(HttpStatus.OK).json({ follow });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCompany,
  updateCompany,
  uploadLogo,
  connectToStripe,
  getMyCompanies,
  getFollowedCompanies,
  toggleFollowStatus,
};
