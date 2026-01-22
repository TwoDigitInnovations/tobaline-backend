const authRoutes = require("@routes/authRoutes");
const contactRoutes = require("@routes/contactusRoutes");

module.exports = (app) => {
  app.use("/auth", authRoutes);
  app.use("/contactus", contactRoutes);
};
