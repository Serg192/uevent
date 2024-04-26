const Joi = require("joi");
const { LAT, LONG } = require("../../config/constants");

const CreateCompany = Joi.object({
  name: Joi.string().min(4).max(100).required(),
  email: Joi.string().email().required(),
  lat: Joi.number().required().min(LAT.min).max(LAT.max),
  long: Joi.number().required().min(LONG.min).max(LONG.max),
});

const UpdateCompany = Joi.object({
  name: Joi.string().min(4).max(100),
  email: Joi.string().email(),
  lat: Joi.number().min(LAT.min).max(LAT.max),
  long: Joi.number().min(LONG.min).max(LONG.max),
});

module.exports = { CreateCompany, UpdateCompany };
