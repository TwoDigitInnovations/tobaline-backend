const express = require("express");
const router = express.Router();
const Stripe = require("@controllers/Stripe");

const isAuthenticated = require("../middlewares/authMiddleware");

router.post("/poststripe", Stripe.poststripe);

module.exports = router;
