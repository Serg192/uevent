const express = require("express");
const auth = require("./auth");
const user = require("./user");
const company = require("./company");
const event = require("./event");

const { jwtAuth } = require("../middlewares/jwt-auth-mid");

const router = express.Router();

router.use("/auth", auth);
router.use("/events", event);
router.use("/users", jwtAuth, user);
router.use("/companies", company);

module.exports = router;
