const HttpStatus = require("http-status-codes").StatusCodes;
const logger = require("../../config/logger");
const authService = require("../services/auth-service");

const signup = async (req, res) => {
  const user = await authService.signup(req.body);
  return res.status(HttpStatus.CREATED).json({ data: { user } });
};

const login = async (req, res) => {
  const { accessToken, refreshToken } = await authService.login(req.body);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
  });
  return res.status(HttpStatus.OK).json({ accessToken });
};

const verifyEmail = (req, res) => {
  authService.verifyEmail(req.body.token);
  return res.status(HttpStatus.OK).json({});
};

const refreshToken = async (req, res) => {
  const refreshT = req.cookies["refreshToken"];
  if (!refreshT)
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: "Refresh token was not found" });

  const accessToken = await authService.refreshToken(refreshT);
  return res.status(HttpStatus.CREATED).json({ accessToken });
};

const resetPassword = async (req, res) => {
  await authService.resetPassword(req.body.email);
  return res.status(HttpStatus.OK).json({});
};

const confirmPasswordReset = async (req, res) => {
  await authService.confirmPasswordReset(req.body);
  return res.status(HttpStatus.OK).json({});
};

const logout = async (req, res) => {
  const refreshToken = req.cookies["refreshToken"];
  res.clearCookie("refreshToken", { httpOnly: true });

  logger.info("Clear cookies");
  logger.info(`${refreshToken}`);
  if (refreshToken) await authService.logout(refreshToken);
  return res.status(HttpStatus.OK).json({});
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
