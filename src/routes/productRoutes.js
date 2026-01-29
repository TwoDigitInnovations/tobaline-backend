const express = require("express");
const router = express.Router();
const product = require("@controllers/product");

const isAuthenticated = require("../middlewares/authMiddleware");

router.post("/createProduct", product.createProduct);
router.get("/getProduct", product.getProduct);
router.post("/updateProduct", product.updateProduct);
router.delete("/deleteProduct/:id", product.deleteProduct);
router.get("/getProductById/:id", product.getProductById);
router.get("/getProductBySlug", product.getProductBySlug);
router.get("/getProductBycategoryId", product.getProductBycategoryId);
router.get("/getProductbycategory/:id", product.getProductbycategory);
router.get("/getProductBythemeId/:id", product.getProductBythemeId);
router.post("/createProductRequest", product.requestProduct);
router.get(
  "/getrequestProduct",
  isAuthenticated(["ADMIN", "USER"]),
  product.getrequestProduct,
);
router.get(
  "/getHistoryProduct",
  isAuthenticated(["USER"]),
  product.getHistoryProduct,
);
router.get("/getProductByFilter", product.getProductByCatgeoryName);
router.get("/getColors", product.getColors);
router.get("/getBrand", product.getBrand);
router.post("/getOrderBySeller", product.getOrderBySeller);
router.get("/productsearch", product.productSearch);
router.get("/getProductRequest/:id", product.getrequestProductbyid);
router.post("/giverate", isAuthenticated(["USER"]), product.giverate);
router.get("/dashboarddetails", product.dashboarddetails);
router.get("/getMonthlySales", product.getMonthlySales);
router.get("/getTopSoldProduct", product.getTopSoldProduct);
router.get("/getLowStockProduct", product.getLowStockProduct);

module.exports = router;
