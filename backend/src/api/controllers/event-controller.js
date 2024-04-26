const HttpStatus = require("http-status-codes").StatusCodes;
const { FORMATS, THEMES } = require("../../config/constants");
const eventService = require("../services/event-service");

const createEvent = async (req, res) => {
  const data = await eventService.createEvent(req.body, req.params.id);
  return res.status(HttpStatus.CREATED).json({ data });
};

const updateEvent = async (req, res) => {
  const data = await eventService.updateEvent(req.body, req.params.eid);
  return res.status(HttpStatus.OK).json({ data });
};

const uploadPicture = async (req, res) => {
  const url = await eventService.uploadPicture(req.params.eid, req.file);
  return res.status(HttpStatus.OK).json({ url });
};

const getEvents = async (req, res) => {
  let { page, pageSize, order, format, themes } = req.query;

  if (!page || page <= 0) page = 1;
  if (!pageSize || pageSize <= 0) pageSize = 10;

  const pagination = {
    page,
    pageSize,
    sort: { date: order === "ASC" ? 1 : -1 },
  };

  themes = themes?.split(",")?.filter((th) => THEMES.includes(th));

  const filter = {
    ...(FORMATS.includes(format) && { format }),
    ...(themes?.length && { themes: { $all: themes } }),
  };

  const result = await eventService.getEvents(pagination, filter);

  return res.status(HttpStatus.OK).json({ result });
};

module.exports = { createEvent, updateEvent, uploadPicture, getEvents };
