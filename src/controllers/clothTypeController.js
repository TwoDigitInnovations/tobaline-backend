"use strict";

const ClothType = require("@models/ClothType");
const mongoose = require("mongoose");
const response = require("../responses");

module.exports = {
  createClothType: async (req, res) => {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }

      const slug = name
        .toLowerCase()
        .trim()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

      const exists = await ClothType.findOne({ slug });
      if (exists) {
        return res.status(409).json({ message: "Cloth type already exists" });
      }

      const clothType = new ClothType({ name, slug });
      const saved = await clothType.save();

      return response.ok(res, saved, {
        message: "Cloth type added successfully",
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getClothTypes: async (req, res) => {
    try {
      const list = await ClothType.find({ isActive: true }).sort({
        createdAt: -1,
      });
      return response.ok(res, list);
    } catch (error) {
      return response.error(res, error);
    }
  },

  updateClothType: async (req, res) => {
    try {
      const { _id, name, image, isActive } = req.body;

      if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const slug = name
        .toLowerCase()
        .trim()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

      const updated = await ClothType.findByIdAndUpdate(
        _id,
        { name, slug, isActive },
        { new: true },
      );

      if (!updated) {
        return res.status(404).json({ message: "Cloth type not found" });
      }

      return response.ok(res, updated, {
        message: "Cloth type updated successfully",
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  deleteClothType: async (req, res) => {
    try {
      const { id } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const deleted = await ClothType.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: "Cloth type not found" });
      }

      return response.ok(res, null, {
        message: "Cloth type deleted successfully",
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
