const express = require("express");
const userController = require("../controllers/user-controller");

const router = express.Router();

router.get("/me", userController.me);
router.get("/search", userController.searchByEmail);

module.exports = router;
