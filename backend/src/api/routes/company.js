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

const router = express.Router();

router.post(
  "/",
  validate(cSchema.CreateCompany),
  catchAsyncErr(companyController.createCompany)
);

router.patch(
  "/:id",
  companyGuard,
  validate(cSchema.UpdateCompany),
  catchAsyncErr(companyController.updateCompany)
);

router.post(
  "/:id/logo",
  companyGuard,
  uploadImage,
  catchAsyncErr(companyController.uploadLogo)
);

router.post(
  "/:id/stripe-setup",
  companyGuard,
  catchAsyncErr(companyController.connectToStripe)
);

router.get("/my", catchAsyncErr(companyController.getMyCompanies));
router.get("/followed", catchAsyncErr(companyController.getFollowedCompanies));
router.post(
  "/:id/toggle-follow",
  followCompanyGuard,
  catchAsyncErr(companyController.toggleFollowStatus)
);

// EVENTS
router.post(
  "/:id/event",
  companyGuard,
  validate(eSchema.CreateEvent),
  catchAsyncErr(eventController.createEvent)
);

module.exports = router;
