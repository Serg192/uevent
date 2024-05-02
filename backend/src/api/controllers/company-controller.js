const HttpStatus = require("http-status-codes").StatusCodes;
const logger = require("../../config/logger");
const { parsePagination } = require("../helpers/pagination-helper");
const { dateFilterRegex } = require("../../config/regex");
const companyService = require("../services/company-service");

const createCompany = async (req, res) => {
  const data = await companyService.createCompany(req.body, req.userId);
  return res.status(HttpStatus.CREATED).json({ data });
};

const updateCompany = async (req, res) => {
  const data = await companyService.updateCompany(req.body, req.params.id);
  return res.status(HttpStatus.OK).json({ data });
};

const getCompany = async (req, res) => {
  const data = await companyService.getCompany(req.params.id);
  return res.status(HttpStatus.OK).json({ data });
};

const uploadLogo = async (req, res) => {
  const url = await companyService.uploadLogo(req.params.id, req.file);
  return res.status(HttpStatus.OK).json({ url });
};

const connectToStripe = async (req, res) => {
  const url = await companyService.connectToStripe(req.params.id);
  return res.status(HttpStatus.OK).json({ url });
};

const getStripeAccount = async (req, res) => {
  const url = await companyService.getStripeAccount(req.params.id);
  return res.status(HttpStatus.OK).json({ url });
};

const getMyCompanies = async (req, res) => {
  const pagination = parsePagination(req);
  const data = await companyService.getUserCompanies(pagination, req.userId);
  return res.status(HttpStatus.OK).json({ data });
};

const getAll = async (req, res) => {
  const pagination = parsePagination(req);
  const search = req.query.search;
  const data = await companyService.getAll(pagination, search);
  return res.status(HttpStatus.OK).json({ data });
};

const getCompanyEvents = async (req, res) => {
  const pagination = parsePagination(req);
  const { startDate, endDate } = req.query;
  const sDate = dateFilterRegex.test(startDate) && new Date(startDate);
  const eDate = dateFilterRegex.test(endDate) && new Date(endDate);

  let filter = {};
  if (sDate || eDate) {
    filter.date = {
      ...(sDate && { $gte: sDate }),
      ...(eDate && { $lte: new Date(eDate.setHours(23, 59, 59, 999)) }),
    };
  }

  const data = await companyService.getCompanyEvents(
    pagination,
    filter,
    req.params.id
  );
  return res.status(HttpStatus.OK).json({ data });
};

const getFollowedCompanies = async (req, res) => {
  const pagination = parsePagination(req);
  const data = await companyService.getFollowedCompanies(
    pagination,
    req.userId
  );
  return res.status(HttpStatus.OK).json({ data });
};

const toggleFollowStatus = async (req, res) => {
  const follow = await companyService.toggleFollowStatus(
    req.userId,
    req.params.id
  );
  return res.status(HttpStatus.OK).json({ follow });
};

module.exports = {
  createCompany,
  updateCompany,
  getCompany,
  uploadLogo,
  connectToStripe,
  getStripeAccount,
  getMyCompanies,
  getAll,
  getCompanyEvents,
  getFollowedCompanies,
  toggleFollowStatus,
};
