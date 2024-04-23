const HttpStatus = require("http-status-codes").StatusCodes;
const userService = require("../services/user-service");

const me = async (req, res, next) => {
  const user = await userService.findOne({ _id: req.userId });
  return res.status(HttpStatus.OK).json({ user });
};

const searchByEmail = async (req, res, next) => {
  const users = await userService.searchUsers(req.query.emailPattern);
  return res.status(HttpStatus.OK).json({ users });
};

module.exports = { me, searchByEmail };
