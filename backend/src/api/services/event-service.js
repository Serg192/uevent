const HttpStatus = require("http-status-codes").StatusCodes;
const Event = require("../models/event-model");
const User = require("../models/user-model");
const Company = require("../models/company-model");
const EventSubscriptionModel = require("../models/event-subscription-model");
const PromoCodeModel = require("../models/promo-codes-model");
const s3Service = require("./s3-service");
const paymentService = require("./payment-service");
const logger = require("../../config/logger");

const { lineEventItem } = require("../helpers/payment-helper");
const { paginate } = require("../helpers/pagination-helper");
const { encrypt, decrypt } = require("../helpers/encryption-helper");
const { default: mongoose } = require("mongoose");

const {
  sendEmail,
  EVENT_CREATED_TEMPLATE,
} = require("../helpers/email-helper");

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

  const response = await event.save();

  const company = await Company.findById(companyId)
    .populate("followers")
    .exec();

  company.followers.forEach((f) => {
    const context = {
      username: f.username,
      companyName: company.name,
      eventTitle: response.name,
      eventDate: response.date,
      eventLocation: response.address,
      eventDescription: response.description,
      eventPrice: response.price === 0 ? "Free" : response.price,
      eventTickets: response.ticketsAvailable,
    };
    sendEmail(f.email, "Event notification", EVENT_CREATED_TEMPLATE, context);
  });

  return response;
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

const getEvent = async (eventId, userId) => {
  console.log("Get event", eventId, userId);
  const event = await Event.findById(eventId).populate({
    path: "company",
    select: "-stripeId",
  });

  let subscribed = false,
    visibleToPublic = false;
  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    const sub = await EventSubscriptionModel.findOne({
      event: eventId,
      user: userId,
    });
    if (sub) {
      subscribed = true;
      visibleToPublic = sub.visibleToPublic;
    }
  }

  const response = { event, subscribed };
  if (subscribed) {
    response.visibleToPublic = visibleToPublic;
  }

  return response;
};

const getSubscribedUsers = async (eventId, paginationOpt) => {
  return await paginate(
    EventSubscriptionModel,
    paginationOpt,
    { event: eventId, visibleToPublic: true },
    {
      path: "user",
      select: "-password",
    }
  );
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

const createPaymentSession = async (eventId, userId, promoCode) => {
  const user = await User.findById(userId);
  const event = await Event.findById(eventId).populate({
    path: "company",
  });

  const subscribed = await EventSubscriptionModel.countDocuments({
    event: eventId,
    user: userId,
  });

  if (subscribed) {
    return { subscribed: true };
  }

  if (event.ticketsAvailable <= 0) {
    throw {
      statusCode: HttpStatus.METHOD_NOT_ALLOWED,
      message: "No tickets",
    };
  }

  if (event.price === 0) {
    await subscribe(userId, eventId);
    return { subscribed: true };
  }

  if (!paymentService.isAccountValid(event.company.stripeId)) {
    logger.error(`Stripe account is not valid`);
  }

  let discount = 0;
  if (promoCode) {
    const code = await PromoCodeModel.findOne({
      event: eventId,
      code: encrypt(promoCode),
    });
    if (!code) {
      throw {
        statusCode: HttpStatus.NOT_FOUND,
        message: "Promo code is not valid",
      };
    }
    discount = event.price - event.price * (code.discount / 100);
  }

  const session = await paymentService.createPaymentSession(
    [lineEventItem(event, discount)],
    user.email,
    event.company.stripeId,
    { userId, eventId: event._id.toString() },
    eventId
  );

  return { subscribed: false, url: session.url };
};

const subscribe = async (userId, eventId) => {
  const subscribtion = new EventSubscriptionModel({
    event: eventId,
    user: userId,
    visibleToPublic: true,
  });

  const event = await Event.findById(eventId);
  event.ticketsAvailable = event.ticketsAvailable - 1;
  await event.save();

  return await subscribtion.save();
};

const getSubscribedEvents = async (userId, paginationOpt) => {
  return await paginate(
    EventSubscriptionModel,
    paginationOpt,
    { user: userId },
    {
      path: "event",
    }
  );
};

const toggleVisibleToPublic = async (eventId, userId) => {
  const subscription = await EventSubscriptionModel.findOne({
    user: userId,
    event: eventId,
  });

  if (!subscription) {
    throw {
      statusCode: HttpStatus.NOT_FOUND,
      message: "Subscription not found",
    };
  }

  subscription.visibleToPublic = !subscription.visibleToPublic;
  await subscription.save();

  return { visible: subscription.visibleToPublic };
};

const createPromoCode = async (promoCodeData, eventId) => {
  const exist = await PromoCodeModel.findOne({
    code: encrypt(promoCodeData.code),
    event: eventId,
  });

  if (exist) {
    throw {
      statusCode: HttpStatus.CONFLICT,
      message: "Promo code is already exist",
    };
  }

  const code = new PromoCodeModel({ ...promoCodeData, event: eventId });
  const saved = await code.save();
  saved.code = decrypt(saved.code);
  return saved;
};

const updatePromoCode = async (codeData, codeId) => {
  if (codeData.code) {
    codeData.code = encrypt(codeData.code);
  }
  const updated = await PromoCodeModel.findByIdAndUpdate(
    { _id: codeId },
    codeData,
    {
      new: true,
    }
  );
  updated.code = decrypt(updated.code);
  return updated;
};

const deletePromoCode = async (codeId) => {
  await PromoCodeModel.findByIdAndDelete(codeId);
};

const getEventPromoCodes = async (pagination, eventId) => {
  return await paginate(PromoCodeModel, pagination, { event: eventId });
  //return await PromoCodeModel.find({ event: eventId });
};

module.exports = {
  createEvent,
  updateEvent,
  getEvent,
  getSubscribedUsers,
  uploadPicture,
  getEvents,
  createPaymentSession,
  subscribe,
  getSubscribedEvents,
  toggleVisibleToPublic,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  getEventPromoCodes,
};
