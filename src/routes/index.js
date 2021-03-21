"use strict";
exports.setup = function (app) {
  /* test route */
  var testRoute = require("./testRoute");

  /* auth routes*/
  const authRoutes = require("./AuthRoutes");

  app.use("/api/test", testRoute);

  /* Auth Routes */
  app.use("/api/admin", authRoutes);
  app.use("/api", authRoutes);
};

module.exports = exports;
