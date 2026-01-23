const express = require("express");
const router = express.Router();
const Category = require("@controllers/Catgeory");

const isAuthenticated = require("../middlewares/authMiddleware");

router.post("/createCategory", Category.createCategory);
router.get("/getCategories", Category.getCategories);
router.delete("/deleteCategory", Category.deleteCategory);
router.post("/updateCategory", Category.updateCategory);

module.exports = router;
