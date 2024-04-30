const express = require("express");
const uploadImage = require("../middlewares/file-upload-mid");
const cSchema = require("../validations/company-validation");
const eSchema = require("../validations/event-validation");
const { validate } = require("../middlewares/validate-mid");
const { catchAsyncErr } = require("../middlewares/error-boundary");
const {
  companyGuard,
  followCompanyGuard,
} = require("../middlewares/company-guard-mid");
const companyController = require("../controllers/company-controller");
const eventController = require("../controllers/event-controller");
const { jwtAuth } = require("../middlewares/jwt-auth-mid");

const router = express.Router();

router.post(
  "/",
  jwtAuth,
  validate(cSchema.CreateCompany),
  catchAsyncErr(companyController.createCompany)
);

router.patch(
  "/:id",
  jwtAuth,
  companyGuard,
  validate(cSchema.UpdateCompany),
  catchAsyncErr(companyController.updateCompany)
);

router.post(
  "/:id/logo",
  jwtAuth,
  companyGuard,
  uploadImage,
  catchAsyncErr(companyController.uploadLogo)
);

//Stripe
router.post(
  "/:id/stripe-setup",
  jwtAuth,
  companyGuard,
  catchAsyncErr(companyController.connectToStripe)
);

router.get(
  "/:id/stripe-account",
  jwtAuth,
  companyGuard,
  catchAsyncErr(companyController.getStripeAccount)
);

///////////////////
router.get("/my", jwtAuth, catchAsyncErr(companyController.getMyCompanies));
router.get(
  "/followed",
  jwtAuth,
  catchAsyncErr(companyController.getFollowedCompanies)
);
router.post(
  "/:id/toggle-follow",
  jwtAuth,
  followCompanyGuard,
  catchAsyncErr(companyController.toggleFollowStatus)
);

// EVENTS
router.post(
  "/:id/event",
  jwtAuth,
  companyGuard,
  validate(eSchema.CreateEvent),
  catchAsyncErr(eventController.createEvent)
);

//PUBLIC
router.get("/", catchAsyncErr(companyController.getAll));
module.exports = router;
