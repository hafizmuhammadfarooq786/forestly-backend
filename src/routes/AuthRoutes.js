"use strict";
const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/common/AuthControllers");
const tokenControllers = require("../controllers/common/TokenController");
const userControllers = require("../controllers/common/UserControllers");
const {
  verifyRefreshToken,
  verifyToken,
  verifyEmailToken,
} = require("../services/jwtService");

router.post("/jwt/token/auth", async (req, res) => {
  res.json(authControllers.login(req.body));
});

router.post("/signup", async (req, res) => {
  res.json(authControllers.signup(req.body));
});

router.post("/jwt/token/refresh", verifyRefreshToken, async (req, res) => {
  res.json(tokenControllers.refreshToken(req.body));
});

router.get("/me", verifyToken, async (req, res) => {
  res.json(userControllers.retriveMe(req.body));
});

router.post("/forgot-password", async (req, res) => {
  res.json(authControllers.forgotPassword(req.body));
});

router.post(
  "/reset-password-confirmation",
  verifyEmailToken,
  async (req, res) => {
    res.json(authControllers.resetEmailTokenConfirmation(req.body));
  }
);

router.post("/reset-password", async (req, res) => {
  res.json(authControllers.resetPassword(req.body));
});

router.post("/delete-account", async (req, res) => {
  res.json(authControllers.deleteAccount(req.body));
});

router.post("/confirm-email", verifyEmailToken, async (req, res) => {
  res.json(authControllers.emailTokenConfirmation(req.body));
});

module.exports = router;
