const HttpStatus = require("http-status-codes").StatusCodes;
const { FORMATS, THEMES } = require("../../config/constants");
const { parsePagination } = require("../helpers/pagination-helper");
const eventService = require("../services/event-service");

const createEvent = async (req, res) => {
  const data = await eventService.createEvent(req.body, req.params.id);
  return res.status(HttpStatus.CREATED).json({ data });
};

const updateEvent = async (req, res) => {
  const data = await eventService.updateEvent(req.body, req.params.eid);
  return res.status(HttpStatus.OK).json({ data });
};

const getEvent = async (req, res) => {
  const data = await eventService.getEvent(req.params.eid, req.query.uid);
  return res.status(HttpStatus.OK).json({ data });
};

const uploadPicture = async (req, res) => {
  const url = await eventService.uploadPicture(req.params.eid, req.file);
  return res.status(HttpStatus.OK).json({ url });
};

const getEvents = async (req, res) => {
  let { order, format, themes, search } = req.query;

  const pagination = parsePagination(req);
  pagination.sort = { date: order === "ASC" ? 1 : -1 };

  themes = themes?.split(",")?.filter((th) => THEMES.includes(th));

  const filter = {
    ...(FORMATS.includes(format) && { format }),
    ...(themes?.length && { themes: { $all: themes } }),
    ...(search && { name: { $regex: new RegExp(`^${search}`, "i") } }),
  };

  const result = await eventService.getEvents(pagination, filter);

  return res.status(HttpStatus.OK).json({ result });
};

const subscribe = async (req, res) => {
  const data = await eventService.createPaymentSession(
    req.params.eid,
    req.userId,
    req.body.code
  );
  return res.status(HttpStatus.OK).json({ data });
};

const getSubscribedEvents = async (req, res) => {
  const result = await eventService.getSubscribedEvents(
    req.userId,
    parsePagination(req)
  );
  return res.status(HttpStatus.OK).json({ result });
};

const getSubscribedUsers = async (req, res) => {
  const pagination = parsePagination(req);
  const data = await eventService.getSubscribedUsers(
    req.params.eid,
    pagination
  );
  return res.status(HttpStatus.OK).json({ data });
};

const toggleVisibleToPublic = async (req, res) => {
  const data = await eventService.toggleVisibleToPublic(
    req.params.eid,
    req.userId
  );

  return res.status(HttpStatus.OK).json({ data });
};

const createPromoCode = async (req, res) => {
  const data = await eventService.createPromoCode(req.body, req.params.eid);
  return res.status(HttpStatus.CREATED).json({ data });
};

const updatePromoCode = async (req, res) => {
  const data = await eventService.updatePromoCode(req.body, req.params.cid);
  return res.status(HttpStatus.OK).json({ data });
};

const deletePromoCode = async (req, res) => {
  await eventService.deletePromoCode(req.params.cid);
  return res.status(HttpStatus.OK).json({});
};

const getEventPromoCodes = async (req, res) => {
  const pagination = parsePagination(req);
  const data = await eventService.getEventPromoCodes(
    pagination,
    req.params.eid
  );
  return res.status(HttpStatus.OK).json({ data });
};

module.exports = {
  createEvent,
  updateEvent,
  getEvent,
  uploadPicture,
  getEvents,
  subscribe,
  getSubscribedEvents,
  getSubscribedUsers,
  toggleVisibleToPublic,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  getEventPromoCodes,
};
