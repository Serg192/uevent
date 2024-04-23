const { Schema, model } = require("mongoose");

const TokenBlacklistModel = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = model("tokens", TokenBlacklistModel);
