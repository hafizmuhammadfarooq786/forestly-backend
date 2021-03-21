"use strict";
const constants = require("../../constants/Statuses");
const messageConstants = require("../../utils/messageConstants.js");
const responseService = require("../..//services/responseService");
const { isExistReturnAccount } = require("../../resolvers/Accounts");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../services/jwtService");

class TokenController {
  /* refresh token */
  async refreshToken(data) {
    try {
      const { email } = data;
      var user = await isExistReturnAccount(email);
      if (user) {
        const access = await generateAccessToken(user);
        const refresh = await generateRefreshToken(user);
        return responseService.createResponse(
          constants.STATUS.SUCCESS,
          { access, refresh },
          messageConstants.UPDATED_TOKENS
        );
      } else {
        return responseService.createResponse(
          constants.STATUS.ERROR,
          {},
          messageConstants.INVALID_EMAIL
        );
      }
    } catch (error) {
      return responseService.createResponse(
        constants.STATUS.ERROR,
        error,
        messageConstants.INVALID_TOKEN
      );
    }
  }
}

module.exports = new TokenController();
