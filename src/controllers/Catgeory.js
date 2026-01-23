"use strict";

const Category = require("@models/Category");
const mongoose = require("mongoose");
const response = require("../responses");

module.exports = {
  createCategory: async (req, res) => {
    try {
      const { name, Attribute } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }

      const slug = name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

      const category = new Category({
        name,
        slug,
        Attribute,
      });
      const savedCategory = await category.save();

      return response.ok(res, savedCategory, {
        message: "Category added successfully",
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getCategories: async (req, res) => {
    try {
      const categories = await Category.find({});
      return response.ok(res, categories);
    } catch (error) {
      return response.error(res, error);
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const deletedCategory = await Category.findByIdAndDelete(id);
      if (!deletedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      return response.ok(res, null, {
        message: "Category deleted successfully",
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { name, _id, Attribute } = req.body;
      const slug = name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

      const updatedCategory = await Category.findByIdAndUpdate(
        _id,
        { name, slug, Attribute },
        { new: true },
      );

      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      return response.ok(res, updatedCategory, {
        message: "Category updated successfully",
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
