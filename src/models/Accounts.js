const mongoose = require("mongoose");
const AccountsSchema = require("../schemas/Accounts");
const AccountModel = mongoose.model("Accounts", AccountsSchema);

module.exports = AccountModel;
