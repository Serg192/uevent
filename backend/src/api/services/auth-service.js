const HttpStatus = require("http-status-codes").StatusCodes;
const jwt = require("jsonwebtoken");
const logger = require("../../config/logger");
const User = require("../models/user-model");
const TokenBlacklist = require("../models/token-blacklist");

const { bcryptCompareAsync } = require("../helpers/bcrypt-helper");
const { jwtVerifyAsync } = require("../helpers/jwt-helper");

/*
  TODO: JWT blacklisting should be implemented using Redis to improve performance
*/

const {
  sendEmail,
  VERIFY_EMAIL_TEMPLATE,
  RESET_PASSWORD_TEMPLATE,
} = require("../helpers/email-helper");

const signup = async (userData) => {
  const exist = await User.findByEmail(userData.email);

  if (exist) {
    throw {
      statusCode: HttpStatus.CONFLICT,
      message: "User with such email is already exist",
    };
  }
  const newUser = new User(userData);
  await newUser.save();

  //Send email verification link
  const vTSecret = process.env.JWT_CONFIRM_TOKEN_SECRET;
  const vTExp = process.env.JWT_CONFIRM_EMAIL_TOKEN_EXPIRATION_TIME;
  const verifyEmailToken = jwt.sign({ userId: newUser._id }, vTSecret, {
    expiresIn: vTExp,
  });

  const context = {
    username: newUser.username,
    verificationLink: `${process.env.CLIENT_URL}/verify-email?token=${verifyEmailToken}`,
  };
  sendEmail(
    newUser.email,
    "Email Verification",
    VERIFY_EMAIL_TEMPLATE,
    context
  );

  return await User.findOne({ email: userData.email }).select("-password");
};

const login = async (userData) => {
  const user = await User.findByEmail(userData.email);

  const error = {
    statusCode: HttpStatus.UNAUTHORIZED,
    message: "Email or password is incorrect",
  };

  if (!user) throw error;

  if (!user.emailVerified) {
    throw {
      statusCode: HttpStatus.UNAUTHORIZED,
      message: "Please verify your email",
    };
  }

  try {
    const result = await bcryptCompareAsync(userData.password, user.password);
    if (!result) throw error;

    const payload = {
      userId: user._id,
    };

    const atSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
    const atExp = process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME;
    const rtSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
    const rtExp = process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME;

    const accessToken = jwt.sign(payload, atSecret, {
      expiresIn: atExp,
    });

    const refreshToken = jwt.sign(payload, rtSecret, {
      expiresIn: rtExp,
    });

    return { accessToken, refreshToken };
  } catch (err) {
    logger.error(err);
    throw error;
  }
};

const verifyEmail = (token) => {
  const error = {
    statusCode: HttpStatus.FORBIDDEN,
    message: "Can't verify email, token is not valid",
  };
  jwt.verify(
    token,
    process.env.JWT_CONFIRM_TOKEN_SECRET,
    async (err, payload) => {
      if (err) throw error;

      const user = await User.findById(payload.userId);
      if (!user) throw error;

      user.emailVerified = true;
      await user.save();
      return true;
    }
  );
};

const confirmPasswordReset = async (data) => {
  const error = {
    statusCode: HttpStatus.FORBIDDEN,
    message: "Can't reset password, token is not valid",
  };

  try {
    const payload = await jwtVerifyAsync(
      data.token,
      process.env.JWT_CONFIRM_TOKEN_SECRET
    );

    const invalid = await TokenBlacklist.findOne({ token: data.token });
    const user = await User.findById(payload.userId);

    if (!user || invalid) throw error;

    user.password = data.password;
    await user.save();

    const invToken = new TokenBlacklist({ token: data.token });
    await invToken.save();
  } catch (err) {
    throw error;
  }
};

const resetPassword = async (email) => {
  const user = await User.findByEmail(email);

  if (user) {
    const rtSecret = process.env.JWT_CONFIRM_TOKEN_SECRET;
    const rtExp = process.env.JWT_CONFIRM_PASSWORD_RESET_TOKEN_EXPIRATION_TIME;
    const confToken = jwt.sign({ userId: user._id }, rtSecret, {
      expiresIn: rtExp,
    });

    const context = {
      username: user.username,
      resetLink: `${process.env.CLIENT_URL}/verify-password-reset?token=${confToken}`,
    };
    sendEmail(email, "Password Reset", RESET_PASSWORD_TEMPLATE, context);
  }
};

const refreshToken = async (token) => {
  const error = {
    statusCode: HttpStatus.UNAUTHORIZED,
    message: "Refresh token is not valid",
  };

  const invalidToken = await TokenBlacklist.findOne({ token });
  if (invalidToken) throw error;

  try {
    const payload = await jwtVerifyAsync(
      token,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );
    const atSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
    const atExp = process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME;
    const acessToken = jwt.sign({ userId: payload.userId }, atSecret, {
      expiresIn: atExp,
    });
    return acessToken;
  } catch (err) {
    throw error;
  }
};

const logout = async (refreshToken) => {
  const invToken = new TokenBlacklist({ token: refreshToken });
  await invToken.save();
};

module.exports = {
  signup,
  login,
  verifyEmail,
  resetPassword,
  confirmPasswordReset,
  refreshToken,
  logout,
};
