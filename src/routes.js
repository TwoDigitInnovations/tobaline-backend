const authRoutes = require("@routes/authRoutes");
const contactRoutes = require("@routes/contactusRoutes");
const categoryRoutes = require("@routes/CatgeoryRoutes");
const productRoutes = require("@routes/productRoutes");
const clothtypeRoutes = require("@routes/ClothTypeRoutes");

module.exports = (app) => {
  app.use("/auth", authRoutes);
  app.use("/contactus", contactRoutes);
  app.use("/category", categoryRoutes);
  app.use("/product",productRoutes);
  app.use("/clothtype",clothtypeRoutes);
};
