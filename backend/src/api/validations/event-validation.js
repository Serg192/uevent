const Joi = require("joi");
const { LAT, LONG, FORMATS, THEMES } = require("../../config/constants");

const CreateEvent = Joi.object({
  name: Joi.string().min(4).max(100).required(),
  description: Joi.string().min(16).max(500).required(),
  date: Joi.date().required().iso(),
  price: Joi.number().positive().required(),
  ticketsAvailable: Joi.number().positive().required(),
  lat: Joi.number().required().min(LAT.min).max(LAT.max),
  long: Joi.number().required().min(LONG.min).max(LONG.max),
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
  price: Joi.number().positive(),
  ticketsAvailable: Joi.number().positive(),
  lat: Joi.number().min(LAT.min).max(LAT.max),
  long: Joi.number().min(LONG.min).max(LONG.max),
  format: Joi.string().valid(...FORMATS),
  themes: Joi.array()
    .items(Joi.string().valid(...THEMES))
    .min(1),
});

module.exports = { CreateEvent, UpdateEvent };
