const HttpStatus = require("http-status-codes").StatusCodes;
const logger = require("../../config/logger");
const User = require("../models/user-model");
const s3Service = require("./s3-service");

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

const uploadAvatar = async (userId, file) => {
  const user = await User.findById(userId);

  if (!user) {
    throw {
      statusCode: HttpStatus.NOT_FOUND,
      message: `User with id: ${userId} was not found`,
    };
  }
  const oldProfilePicUrl = user.profilePicture;

  if (oldProfilePicUrl) {
    try {
      const pictureKey = oldProfilePicUrl.split("/");
      await s3Service.deleteFile(pictureKey.pop());
    } catch (err) {
      logger.error(err.message);
    }
  }

  try {
    const url = await s3Service.uploadFile(file);
    user.profilePicture = url;
    await user.save();
    return url;
  } catch (err) {
    throw {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    };
  }
};

module.exports = { findOne, searchUsers, uploadAvatar };
