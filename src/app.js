const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("@config/db");
const passport = require("passport");

require("module-alias/register");
require("dotenv").config();
require("@config/passport")();

const app = express();
connectDB();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(passport.initialize());
const routes = require('./routes');
routes(app);

app.get("/", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use((err, req, res, next) => {
  console.error(req);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;