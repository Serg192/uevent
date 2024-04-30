const HttpStatus = require("http-status-codes").StatusCodes;
const Company = require("../models/company-model");
const mongoose = require("mongoose");

async function getCompany(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: "id is invalid" });
  }
  const company = await Company.findById(req.params.id);
  if (!company) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: `company with id:${req.params.id} does not exist!` });
  }
  return company;
}

async function companyGuard(req, res, next) {
  const company = await getCompany(req, res);

  if (company.owner._id.toString() !== req.userId) {
    return res
      .status(HttpStatus.METHOD_NOT_ALLOWED)
      .json({ message: "You have no permission to perform this action" });
  }
  next();
}

async function followCompanyGuard(req, res, next) {
  const company = await getCompany(req, res);
  if (company.owner._id.toString() === req.userId) {
    return res
      .status(HttpStatus.METHOD_NOT_ALLOWED)
      .json({ message: "You have no permission to perform this action" });
  }
  next();
}

async function companyIdCheck(req, res, next) {
  await getCompany(req, res);
  next();
}

module.exports = { companyGuard, followCompanyGuard, companyIdCheck };
