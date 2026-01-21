const express = require("express");
const router = express.Router();
const {
  login,
  register,
  sendOTP,
  verifyOTP,
  changePassword,
  myProfile,
  updateprofile,
} = require("@controllers/authController");
const auth = require("@middlewares/authMiddleware");
// const { upload } = require("@services/fileUpload");

router.post("/login", login);
router.post("/register", register);
router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);
router.post("/changePassword", changePassword);
router.get(
  "/profile",
  auth("admin", "user", "guard", "org", "tech"),
  myProfile,
);
// router.post(
//   "/updateprofile",
//   auth("admin", "user", "guard", "org", "tech"),
//   upload.single("image"),
//   updateprofile,
// );

module.exports = router;
