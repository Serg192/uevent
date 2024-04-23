const { Schema, model } = require("mongoose");
const { ROLES } = require("../../config/constants");
const bcrypt = require("bcrypt");

const UserModel = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ROLES,
      default: "user",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    accountDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserModel.pre("save", async function save(next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

UserModel.statics.findByEmail = async function (email) {
  return this.findOne({ email });
};

module.exports = model("users", UserModel);
