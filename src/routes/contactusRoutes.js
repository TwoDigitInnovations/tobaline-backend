const express = require("express");
const router = express.Router();
const contactus = require("@controllers/contactUs");

const isAuthenticated = require("../middlewares/authMiddleware");

router.post("/create", contactus.contactUs);
router.get("/getAllContactUs", isAuthenticated(["ADMIN"]), contactus.getAllContactUs);
router.put("/updateStatus", isAuthenticated(["ADMIN"]), contactus.updateStatus);

module.exports = router;
