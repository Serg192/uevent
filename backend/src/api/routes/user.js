const express = require("express");
const userController = require("../controllers/user-controller");
const uploadImage = require("../middlewares/file-upload-mid");

const router = express.Router();

router.get("/me", userController.me);
router.get("/search", userController.searchByEmail);
router.post("/avatar", uploadImage, userController.uploadAvatar);

module.exports = router;
