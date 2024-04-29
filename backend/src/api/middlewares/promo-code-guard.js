const HttpStatus = require("http-status-codes").StatusCodes;
const PromoCodeModel = require("../models/promo-codes-model");
const mongoose = require("mongoose");

async function promoCodeGuard(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.cid)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: "cid is invalid" });
  }

  const code = await PromoCodeModel.findById(req.params.cid);
  if (!code) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: `code with id:${req.params.cid} does not exist!` });
  }

  if (code.event._id.toString() !== req.params.eid.toString()) {
    return res
      .status(HttpStatus.METHOD_NOT_ALLOWED)
      .json({ message: "You have no permission to perform this action" });
  }

  next();
}

module.exports = { promoCodeGuard };
