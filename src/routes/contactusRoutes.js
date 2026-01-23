const express = require("express");
const router = express.Router();
const contactus = require("@controllers/contactUs");

const isAuthenticated = require("../middlewares/authMiddleware");

router.post("/create", contactus.contactUs);
router.post("/getAllContactUs", contactus.getAllContactUs);
router.post("/updateStatus", contactus.updateStatus);

module.exports = router;
