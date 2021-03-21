const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;
const AccountsSchema = new Schema(
  {
    accountId: {
      type: String,
      required: true,
      unique: true,
    },
    accountType: {
      type: String,
      default: "user",
    },
    source: {
      type: String,
      required: "Source is missing",
    },
    email: {
      type: String,
      required: "Email is required",
    },
    password: {
      type: String,
      required: "Password is reqired",
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: String,
      default: moment().format("L"),
    },
    updatedAt: {
      type: String,
      default: moment().format("L"),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = AccountsSchema;
