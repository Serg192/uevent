const { Schema, model, default: mongoose } = require("mongoose");

const EventSubscriptionModel = new Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "events",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  visibleToPublic: {
    type: Boolean,
    default: true,
  },
});

module.exports = model("event_subscriptions", EventSubscriptionModel);
