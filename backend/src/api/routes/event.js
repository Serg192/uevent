const express = require("express");
const uploadImage = require("../middlewares/file-upload-mid");
const eSchema = require("../validations/event-validation");
const { validate } = require("../middlewares/validate-mid");
const { catchAsyncErr } = require("../middlewares/error-boundary");
const { jwtAuth } = require("../middlewares/jwt-auth-mid");
const { eventGuard } = require("../middlewares/event-guard-mid");
const { promoCodeGuard } = require("../middlewares/promo-code-guard");

const eventController = require("../controllers/event-controller");

const router = express.Router();

router.patch(
  "/:eid",
  jwtAuth,
  eventGuard("owner"),
  validate(eSchema.UpdateEvent),
  catchAsyncErr(eventController.updateEvent)
);

//Promo code
router.post(
  "/:eid/promo",
  jwtAuth,
  eventGuard("owner"),
  validate(eSchema.CreatePromoCode),
  catchAsyncErr(eventController.createPromoCode)
);

router.patch(
  "/:eid/promo/:cid",
  jwtAuth,
  eventGuard("owner"),
  promoCodeGuard,
  validate(eSchema.UpdatePromoCode),
  catchAsyncErr(eventController.updatePromoCode)
);

router.delete(
  "/:eid/promo/:cid",
  jwtAuth,
  eventGuard("owner"),
  promoCodeGuard,
  catchAsyncErr(eventController.deletePromoCode)
);

router.get(
  "/:eid/promo",
  jwtAuth,
  eventGuard("owner"),
  catchAsyncErr(eventController.getEventPromoCodes)
);
/////////////////////////////////////////////

router.post(
  "/:eid/poster",
  jwtAuth,
  eventGuard("owner"),
  uploadImage,
  catchAsyncErr(eventController.uploadPicture)
);

router.post(
  "/:eid/subscribe",
  jwtAuth,
  eventGuard("user"),
  catchAsyncErr(eventController.subscribe)
);

router.get("/", catchAsyncErr(eventController.getEvents));
router.get(
  "/subscribed",
  jwtAuth,
  catchAsyncErr(eventController.getSubscribedEvents)
);

router.post(
  "/:eid/toggle-user-visibility",
  jwtAuth,
  eventGuard("user"),
  catchAsyncErr(eventController.toggleVisibleToPublic)
);

router.get("/:eid", eventGuard("any"), catchAsyncErr(eventController.getEvent));
router.get(
  "/:eid/subscribed-users",
  eventGuard("any"),
  catchAsyncErr(eventController.getSubscribedUsers)
);

module.exports = router;
