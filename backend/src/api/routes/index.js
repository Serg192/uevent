const express = require("express");
const auth = require("./auth");
const user = require("./user");
const company = require("./company");

const { jwtAuth } = require("../middlewares/jwt-auth-mid");

const router = express.Router();

router.use("/auth", auth);
router.use("/users", jwtAuth, user);
router.use("/companies", jwtAuth, company);

module.exports = router;
