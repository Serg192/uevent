const express = require("express");
const uploadImage = require("../middlewares/file-upload-mid");
const vSchema = require("../validations/company-validation");
const { validate } = require("../middlewares/validate-mid");
const {
  companyGuard,
  followCompanyGuard,
} = require("../middlewares/company-guard-mid");
const companyController = require("../controllers/company-controller");

const router = express.Router();

router.post(
  "/",
  validate(vSchema.CreateCompany),
  companyController.createCompany
);

router.patch(
  "/:id",
  companyGuard,
  validate(vSchema.UpdateCompany),
  companyController.updateCompany
);

router.post(
  "/:id/logo",
  companyGuard,
  uploadImage,
  companyController.uploadLogo
);

router.post(
  "/:id/stripe-setup",
  companyGuard,
  companyController.connectToStripe
);

router.get("/my", companyController.getMyCompanies);
router.get("/followed", companyController.getFollowedCompanies);
router.post(
  "/:id/toggle-follow",
  followCompanyGuard,
  companyController.toggleFollowStatus
);

// EVENTS

module.exports = router;
