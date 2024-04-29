const { encrypt, decrypt } = require("../helpers/encryption-helper");
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

PromoCodeModel.pre("save", function save(next) {
  if (this.isModified("code")) {
    this.code = encrypt(this.code);
  }
  return next();
});

PromoCodeModel.post("find", function (docs, next) {
  docs.forEach((doc) => {
    doc.code = decrypt(doc.code);
  });
  next();
});

module.exports = model("promo_codes", PromoCodeModel);
