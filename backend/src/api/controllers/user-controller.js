const HttpStatus = require("http-status-codes").StatusCodes;
const logger = require("../../config/logger");
const userService = require("../services/user-service");

const me = async (req, res) => {
  const user = await userService.findOne({ _id: req.userId });
  return res.status(HttpStatus.OK).json({ user });
};

const searchByEmail = async (req, res) => {
  const users = await userService.searchUsers(req.query.emailPattern);
  return res.status(HttpStatus.OK).json({ users });
};

const uploadAvatar = async (req, res) => {
  const url = await userService.uploadAvatar(req.userId, req.file);
  return res.status(HttpStatus.OK).json({ url });
};

module.exports = { me, searchByEmail, uploadAvatar };
