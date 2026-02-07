const authRoutes = require("@routes/authRoutes");
const contactusRoutes = require("@routes/contactusRoutes");
const CatgeoryRoutes = require("@routes/CatgeoryRoutes");
const productRoutes = require("@routes/productRoutes");
const ClothTypeRoutes = require("@routes/ClothTypeRoutes");
const StripeRoutes = require("@routes/StripeRoutes");

module.exports = (app) => {
  app.use("/auth", authRoutes);
  app.use("/contactus", contactusRoutes);
  app.use("/category", CatgeoryRoutes);
  app.use("/product", productRoutes);
  app.use("/clothtype", ClothTypeRoutes);
  app.use("/stripe", StripeRoutes);
};
