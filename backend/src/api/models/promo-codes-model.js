const { Schema, model, default: mongoose } = require("mongoose");

const PromoCodeModel = new Schema({
  code: {
    type: String,
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "events",
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
});

module.exports = model("promo_codes", PromoCodeModel);
