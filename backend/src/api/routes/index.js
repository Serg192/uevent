const express = require("express");
const auth = require("./auth");
const user = require("./user");

const { jwtAuth } = require("../middlewares/jwt-auth-mid");

const router = express.Router();

router.use("/auth", auth);
router.use("/users", jwtAuth, user);

module.exports = router;
