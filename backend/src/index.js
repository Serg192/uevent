require("dotenv").config();

const server = require("./config/express");
const logger = require("./config/logger");
const { connectToDatabase } = require("./config/mongoose");

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  connectToDatabase();
  logger.info(`Server started on PORT ${PORT}`);
});
