const { createLogger, format, transports } = require("winston");

const formatParams = (info) => {
  const { timestamp, level, message, ...args } = info;
  const ts = timestamp.slice(0, 19).replace("T", " ");

  return `${ts} [${level}]: ${message.trim()} ${
    Object.keys(args).length ? JSON.stringify(args, "", "") : ""
  }`;
};

const Format = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.printf(formatParams)
);

const transportArray =
  process.env.NODE_ENV === "prod"
    ? [new transports.File({ filename: "error.log", level: "error" })]
    : [new transports.Console()];

const logger = createLogger({
  level: process.env.NODE_ENV === "prod" ? "error" : "debug",
  format: Format,
  transports: transportArray,
});

module.exports = logger;
