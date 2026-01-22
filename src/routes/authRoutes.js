const express = require("express");
const router = express.Router();
const {
  login,
  register,
  sendOTP,
  verifyOTP,
  changePassword,
  MyProfile,
  updateprofile,
  loginwithOtp,
  verifyOTPForLogin,
} = require("@controllers/authController");

const isAuthenticated = require("../middlewares/authMiddleware");

router.post("/login", login);
router.post("/register", register);
router.post("/loginwithOtp", loginwithOtp);
router.post("/verifyOTPForLogin", verifyOTPForLogin);
router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);
router.post("/changePassword", changePassword);
router.get("/profile", isAuthenticated(["ADMIN", "USER"]), MyProfile);
router.post(
  "/updateprofile",
  isAuthenticated(["ADMIN", "USER"]),
  updateprofile,
);

module.exports = router;
