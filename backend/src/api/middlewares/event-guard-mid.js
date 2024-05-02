const HttpStatus = require("http-status-codes").StatusCodes;
const Event = require("../models/event-model");
const Company = require("../models/company-model");
const mongoose = require("mongoose");

async function getEvent(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.eid)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: "eid is invalid" });
  }
  const event = await Event.findById(req.params.eid);
  if (!event) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: `event with id:${req.params.eid} does not exist!` });
  }
  return event;
}

function eventGuard(auth = "owner") {
  return async (req, res, next) => {
    const owner = auth === "owner";
    const event = await getEvent(req, res);
    const company = await Company.findById(event.company);

    if (!company) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: `Event with id: ${req.params.eid} is spoiled` });
    }

    if (auth === "any") {
      next();
    } else {
      if (
        (owner && req.userId.toString() !== company.owner._id.toString()) ||
        (!owner && req.userId.toString() === company.owner._id.toString())
      ) {
        return res
          .status(HttpStatus.METHOD_NOT_ALLOWED)
          .json({ message: "You have no permission to perform this action" });
      } else {
        next();
      }
    }
  };
}

module.exports = { eventGuard };
