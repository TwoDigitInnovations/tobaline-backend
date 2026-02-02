const authRoutes = require("@routes/authRoutes");
const contactRoutes = require("@routes/contactusRoutes");
const categoryRoutes = require("@routes/catgeoryRoutes");
const productRoutes = require("@routes/productRoutes");
const clothtypeRoutes = require("@routes/clothTypeRoutes");
const stripeRoutes = require("@routes/stripeRoutes");

module.exports = (app) => {
  app.use("/auth", authRoutes);
  app.use("/contactus", contactRoutes);
  app.use("/category", categoryRoutes);
  app.use("/product", productRoutes);
  app.use("/clothtype", clothtypeRoutes);
  app.use("/stripe", stripeRoutes);
};
