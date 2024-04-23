const express = require("express");
const authController = require("../controllers/auth-controller");

const vSchema = require("../validations/auth-validation");
const { validate } = require("../middlewares/validate-mid");

const router = express.Router();

router.post("/signup", validate(vSchema.Signup), authController.signup);
router.post("/login", validate(vSchema.Login), authController.login);
router.post(
  "/verify-email",
  validate(vSchema.TokenVerification),
  authController.verifyEmail
);

router.post(
  "/reset-password",
  validate(vSchema.ResetPassword),
  authController.resetPassword
);

router.post(
  "/confirm-password-reset",
  validate(vSchema.ResetPasswordConf),
  authController.confirmPasswordReset
);

router.get("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);

module.exports = router;
