const Joi = require("joi");
const { passwordRegex } = require("../../config/regex");

const Signup = Joi.object({
  username: Joi.string().min(4).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().regex(passwordRegex).messages({
    "string.pattern.base": "Password is too weak",
  }),
});

const Login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const TokenVerification = Joi.object({
  token: Joi.string().required(),
});

const ResetPassword = Joi.object({
  email: Joi.string().email().required(),
});

const ResetPasswordConf = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().required().regex(passwordRegex).messages({
    "string.pattern.base": "Password is too weak",
  }),
});

module.exports = {
  Signup,
  Login,
  TokenVerification,
  ResetPassword,
  ResetPasswordConf,
};
