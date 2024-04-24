const HttpStatus = require("http-status-codes").StatusCodes;
const logger = require("../../config/logger");
const userService = require("../services/user-service");

const me = async (req, res, next) => {
  const user = await userService.findOne({ _id: req.userId });
  return res.status(HttpStatus.OK).json({ user });
};

const searchByEmail = async (req, res, next) => {
  const users = await userService.searchUsers(req.query.emailPattern);
  return res.status(HttpStatus.OK).json({ users });
};

const uploadAvatar = async (req, res, next) => {
  try {
    const url = await userService.uploadAvatar(req.userId, req.file);
    return res.status(HttpStatus.OK).json({ url });
  } catch (err) {
    next(err);
  }
};

module.exports = { me, searchByEmail, uploadAvatar };
