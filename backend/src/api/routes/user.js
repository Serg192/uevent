const express = require("express");
const userController = require("../controllers/user-controller");
const uploadImage = require("../middlewares/file-upload-mid");
const { catchAsyncErr } = require("../middlewares/error-boundary");

const router = express.Router();

router.get("/me", catchAsyncErr(userController.me));
router.get("/search", catchAsyncErr(userController.searchByEmail));
router.post("/avatar", uploadImage, catchAsyncErr(userController.uploadAvatar));

module.exports = router;
