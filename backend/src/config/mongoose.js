const mongoose = require("mongoose");
const logger = require("./logger");

mongoose.Promise = global.Promise;

mongoose.set("debug", process.env.NODE_ENV === "dev");

mongoose.connection.on("error", (err) => {
  logger.error(`MongoDB Connection Error ${err}`);
});

mongoose.connection.on("connected", () => {
  logger.info("Successfully connected to the database");
});

exports.connectToDatabase = () => {
  mongoose.connect(process.env.DB_URL);
  return mongoose.connection;
};
