const express = require("express");
const authController = require("../controllers/auth-controller");

const vSchema = require("../validations/auth-validation");
const { validate } = require("../middlewares/validate-mid");
const { catchAsyncErr } = require("../middlewares/error-boundary");

const router = express.Router();

router.post(
  "/signup",
  validate(vSchema.Signup),
  catchAsyncErr(authController.signup)
);
router.post(
  "/login",
  validate(vSchema.Login),
  catchAsyncErr(authController.login)
);
router.post(
  "/verify-email",
  validate(vSchema.TokenVerification),
  catchAsyncErr(authController.verifyEmail)
);

router.post(
  "/reset-password",
  validate(vSchema.ResetPassword),
  catchAsyncErr(authController.resetPassword)
);

router.post(
  "/confirm-password-reset",
  validate(vSchema.ResetPasswordConf),
  catchAsyncErr(authController.confirmPasswordReset)
);

router.get("/refresh-token", catchAsyncErr(authController.refreshToken));
router.post("/logout", catchAsyncErr(authController.logout));

module.exports = router;
