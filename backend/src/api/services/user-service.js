const User = require("../models/user-model");

const findOne = async (filter) => {
  return await User.findOne(filter).select("-password");
};

const searchUsers = async (emailPattern) => {
  let filter = {};

  if (emailPattern) {
    const regexPattern = new RegExp(`^${emailPattern}`, "i");
    filter = { email: { $regex: regexPattern }, ...filter };
  }

  const users = await User.find(filter).select("-password").limit(5).exec();
  return users;
};

module.exports = { findOne, searchUsers };
