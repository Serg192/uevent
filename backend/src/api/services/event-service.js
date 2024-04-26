const HttpStatus = require("http-status-codes").StatusCodes;
const Event = require("../models/event-model");
const s3Service = require("./s3-service");
const logger = require("../../config/logger");

const { paginate } = require("../helpers/pagination-helper");

const createEvent = async (eventData, companyId) => {
  const { lat, long, ...data } = eventData;

  const event = new Event({
    ...data,
    location: {
      type: "Point",
      coordinates: [lat, long],
    },
    company: companyId,
  });

  return await event.save();
};

const updateEvent = async (eventData, eventId) => {
  if (eventData.lat || eventData.long) {
    const { lat, long } = eventData;
    const event = await Event.findById(eventId);
    eventData.location = {
      type: "Point",
      coordinates: [
        lat ? lat : event.location.coordinates[0],
        long ? long : event.location.coordinates[1],
      ],
    };
  }

  return await Event.findByIdAndUpdate({ _id: eventId }, eventData, {
    new: true,
  });
};

const uploadPicture = async (eventId, file) => {
  const event = await Event.findById(eventId);
  const oldPicture = event.eventPicture;

  if (oldPicture) {
    try {
      const key = oldPicture.split("/").pop();
      await s3Service.deleteFile(key);
    } catch (err) {
      logger.error(err.message);
    }
  }

  try {
    const url = await s3Service.uploadFile(file);
    event.eventPicture = url;
    await event.save();
    return url;
  } catch (err) {
    throw {
      StatusCodes: HttpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    };
  }
};

const getEvents = async (paginationOpt, filter) => {
  return await paginate(Event, paginationOpt, filter, {
    path: "company",
    select: "-stripeId",
  });
};

module.exports = { createEvent, updateEvent, uploadPicture, getEvents };
