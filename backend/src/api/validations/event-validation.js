const Joi = require("joi");
const { LAT, LONG, FORMATS, THEMES } = require("../../config/constants");

const CreateEvent = Joi.object({
  name: Joi.string().min(4).max(100).required(),
  description: Joi.string().min(16).max(500).required(),
  date: Joi.date().required().iso(),
  price: Joi.number().min(0).required(),
  ticketsAvailable: Joi.number().positive().required(),
  lat: Joi.number().required().min(LAT.min).max(LAT.max),
  long: Joi.number().required().min(LONG.min).max(LONG.max),
  address: Joi.string().required(),
  format: Joi.string()
    .required()
    .valid(...FORMATS),
  themes: Joi.array()
    .items(Joi.string().valid(...THEMES))
    .required()
    .min(1),
});

const UpdateEvent = Joi.object({
  name: Joi.string().min(4).max(100),
  description: Joi.string().min(16).max(500),
  date: Joi.date().iso(),
  price: Joi.number().min(0),
  ticketsAvailable: Joi.number().positive(),
  lat: Joi.number().min(LAT.min).max(LAT.max),
  long: Joi.number().min(LONG.min).max(LONG.max),
  address: Joi.string(),
  format: Joi.string().valid(...FORMATS),
  themes: Joi.array()
    .items(Joi.string().valid(...THEMES))
    .min(1),
});

const CreatePromoCode = Joi.object({
  code: Joi.string().min(5).max(50).required(),
  discount: Joi.number().required().min(1).max(95),
});

const UpdatePromoCode = Joi.object({
  code: Joi.string().min(5).max(50),
  discount: Joi.number().min(1).max(95),
});

module.exports = { CreateEvent, UpdateEvent, CreatePromoCode, UpdatePromoCode };
