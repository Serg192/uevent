const HttpStatus = require("http-status-codes").StatusCodes;
const logger = require("../../config/logger");

function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      logger.error(`Validation error: ${error}`);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.details });
    }
    next();
  };
}

module.exports = { validate };
