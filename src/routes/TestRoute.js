"use strict";
var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
  res.json({
    status: "backend is working fine",
  });
});

module.exports = router;
