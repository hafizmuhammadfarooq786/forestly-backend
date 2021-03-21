"use strict";
const jwt = require("jsonwebtoken");
const constants = require("../constants/Statuses");
const messageConstants = require("./messageService");
const responseService = require("./responseService");

module.exports = {
  /* Access Token */
  generateAccessToken: (user) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const options = {
        expiresIn: "20m",
        issuer: "https://forest.ly",
        audience: user.email,
      };
      jwt.sign(payload, "access", options, (err, token) => {
        if (err) {
          responseService.createResponse(
            constants.CODE.UNAUTHORIZED,
            { auth: false },
            messageConstants.USER_ERROR
          );
        }
        return resolve(token);
      });
    });
  },

  generateAccessTokenForConfirmation: (user) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const options = {
        expiresIn: "1d",
        issuer: "https://forest.ly",
        audience: user.email,
      };
      jwt.sign(payload, "access", options, (err, token) => {
        if (err) {
          responseService.createResponse(
            constants.CODE.UNAUTHORIZED,
            { auth: false },
            messageConstants.USER_ERROR
          );
        }
        return resolve(token);
      });
    });
  },

  /* Refresh Token*/
  generateRefreshToken: (user) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const options = {
        expiresIn: "7d",
        issuer: "https://forest.ly",
        audience: user.email,
      };
      jwt.sign(payload, "refresh", options, (err, token) => {
        if (err) {
          responseService.createResponse(
            constants.CODE.UNAUTHORIZED,
            { auth: false },
            messageConstants.USER_ERROR
          );
        }
        return resolve(token);
      });
    });
  },

  /* Refresh Token Verification */
  verifyRefreshToken(req, res, next) {
    const bearerHeader = req.body["refresh"];
    // Check if bearer is undefined
    try {
      if (typeof bearerHeader !== "undefined") {
        const decode_token = jwt.decode(bearerHeader, { complete: true });
        var i = "https://forest.ly"; // Issuer
        var a = decode_token.payload.aud; // Subject
        var verifyOptions = {
          issuer: i,
          audience: a,
          algorithm: ["RS256"],
        };
        jwt.verify(
          bearerHeader,
          "refresh",
          verifyOptions,
          function (err, decoded) {
            if (err) {
              return res.json(
                responseService.createResponse(
                  constants.CODE.UNAUTHORIZED,
                  { auth: false },
                  messageConstants.AUTHENTICATION_ERROR
                )
              );
            } else {
              req.body.email = decode_token.payload.aud;
              return next();
            }
          }
        );
      } else {
        return res.json(
          responseService.createResponse(
            constants.CODE.UNAUTHORIZED,
            { auth: false },
            messageConstants.AUTHENTICATION
          )
        );
      }
    } catch (error) {
      return res.json(
        responseService.createResponse(
          constants.STATUS.ERROR,
          error,
          messageConstants.EXCEPTION
        )
      );
    }
  },

  /* Headers Token Verification */
  verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    // Check if bearer is undefined
    try {
      if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        const decode_token = jwt.decode(token, { complete: true });
        var i = "https://forest.ly"; // Issuer
        var a = decode_token.payload.aud; // Subject
        var verifyOptions = {
          issuer: i,
          audience: a,
          algorithm: ["RS256"],
        };
        jwt.verify(token, "access", verifyOptions, function (err, decoded) {
          if (err) {
            return res.json(
              responseService.createResponse(
                constants.CODE.UNAUTHORIZED,
                { auth: false },
                messageConstants.AUTHENTICATION_ERROR
              )
            );
          } else {
            req.body.email = decode_token.payload.aud;
            return next();
          }
        });
      } else {
        return res.json(
          responseService.createResponse(
            constants.CODE.UNAUTHORIZED,
            { auth: false },
            messageConstants.AUTHENTICATION
          )
        );
      }
    } catch (error) {
      return res.json(
        responseService.createResponse(
          constants.STATUS.ERROR,
          error,
          messageConstants.EXCEPTION
        )
      );
    }
  },

  /* Email Token Verification */
  verifyEmailToken(req, res, next) {
    const token = req.body.token;
    try {
      if (typeof token !== "undefined") {
        const decode_token = jwt.decode(token, { complete: true });
        var i = "https://forest.ly"; // Issuer
        var a = decode_token.payload.aud; // Subject
        var verifyOptions = {
          issuer: i,
          audience: a,
          algorithm: ["RS256"],
        };
        jwt.verify(token, "access", verifyOptions, function (err, decoded) {
          if (err) {
            return res.json(
              responseService.createResponse(
                constants.CODE.UNAUTHORIZED,
                { auth: false },
                messageConstants.AUTHENTICATION_ERROR
              )
            );
          } else {
            req.body.email = decode_token.payload.aud;
            return next();
          }
        });
      } else {
        return res.json(
          responseService.createResponse(
            constants.CODE.UNAUTHORIZED,
            { auth: false },
            messageConstants.AUTHENTICATION
          )
        );
      }
    } catch (error) {
      return res.json(
        responseService.createResponse(
          constants.STATUS.ERROR,
          error,
          messageConstants.EXCEPTION
        )
      );
    }
  },
};
