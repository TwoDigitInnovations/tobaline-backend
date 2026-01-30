"use strict";

const mongoose = require("mongoose");
const productchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    categoryName: {
      type: String,
    },
    clothType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClothType",
    },
    clothTypeName: {
      type: String,
    },
    origin: {
      type: String,
    },
    metadescription: {
      type: String,
    },
    metatitle: {
      type: String,
    },
    slug: {
      type: String,
    },
    name: {
      type: String,
    },
    gender: {
      type: String,
    },
    image: {
      type: String,
    },
    short_description: {
      type: String,
    },
    long_description: {
      type: String,
    },
    price: {
      type: Number,
    },

    pieces: {
      type: Number,
    },
    sold_pieces: {
      type: Number,
      default: 0,
    },

    returnedQuantity: {
      type: Number,
      default: 0,
    },
    varients: {
      type: [],
    },
    parameter_type: {
      type: String,
    },
    Attribute: [],
    price_slot: [],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", productchema);
