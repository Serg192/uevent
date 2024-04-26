const express = require("express");
const uploadImage = require("../middlewares/file-upload-mid");
const eSchema = require("../validations/event-validation");
const { validate } = require("../middlewares/validate-mid");
const { catchAsyncErr } = require("../middlewares/error-boundary");
const { jwtAuth } = require("../middlewares/jwt-auth-mid");
const { eventGuard } = require("../middlewares/event-guard-mid");

const eventController = require("../controllers/event-controller");

const router = express.Router();

router.patch(
  "/:eid",
  jwtAuth,
  eventGuard("owner"),
  validate(eSchema.UpdateEvent),
  catchAsyncErr(eventController.updateEvent)
);

router.post(
  "/:eid/poster",
  jwtAuth,
  eventGuard("owner"),
  uploadImage,
  catchAsyncErr(eventController.uploadPicture)
);

router.get("/", catchAsyncErr(eventController.getEvents));

module.exports = router;
