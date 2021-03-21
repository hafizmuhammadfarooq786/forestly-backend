"use strict";
exports.setup = function (app) {
  /* auth routes*/
  const authRoutes = require("./AuthRoutes");

  /* Auth Routes */
  app.use("/api/admin", authRoutes);
  app.use("/api", authRoutes);
};

module.exports = exports;
