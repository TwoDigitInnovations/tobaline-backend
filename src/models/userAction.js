"use strict";
const mongoose = require("mongoose");

const UserActionLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: false,
    },

    action: {
      type: String,
      required: true,
      index: true,
    },

    method: {
      type: String,
      enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      required: true,
    },

    endpoint: {
      type: String,
      required: true,
    },
    ipConfig: {
      type: Object,
      index: true,
    },

    userAgent: {
      type: String,
    },

    meta: {
      type: Object,
    },

    status: {
      type: String,
      enum: ["SUCCESS", "FAILURE"],
      default: "SUCCESS",
    },
    createdAt: { type: Date, expires: "90d" },
  },
  {
    timestamps: true, 
  },
);


UserActionLogSchema.index({ createdAt: -1 });
UserActionLogSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model("UserActionLog", UserActionLogSchema);
