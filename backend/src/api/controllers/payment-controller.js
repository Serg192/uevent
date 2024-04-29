const HttpStatus = require("http-status-codes").StatusCodes;
const logger = require("../../config/logger");
const eventService = require("../services/event-service");
const paymentService = require("../services/payment-service");

const webhook = async (req, res) => {
  const stripeEvent = paymentService.constructEvent(
    req.headers["stripe-signature"],
    req.body
  );

  switch (stripeEvent.type) {
    case "payment_intent.succeeded":
      const { userId, eventId } = stripeEvent.data.object.metadata;
      await eventService.subscribe(userId, eventId);
      break;
    default:
  }
  return res.status(HttpStatus.OK).json({});
};

module.exports = { webhook };
