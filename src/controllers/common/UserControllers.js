"use strict";
const constants = require("../../constants/Statuses");
const messageConstants = require("../../utils/messageConstants.js");
const responseService = require("../../services/responseService");
const { isExistReturnAccount } = require("../../resolvers/Accounts");

class UserController {
  /*  Retrive current user record */
  async retriveMe(data) {
    if (!data.email) {
      return responseService.createResponse(
        constants.STATUS.ERROR,
        data,
        messageConstants.DATA_MISSING
      );
    }
    try {
      const user = await isExistReturnAccount(data.email);
      if (user) {
        const params = {
          accountType: user.accountType,
          createdAt: user.createdAt,
          accountId: user.accountId,
          email: user.email,
          source: user.source,
        };
        return responseService.createResponse(
          constants.STATUS.SUCCESS,
          { user: params },
          messageConstants.USER_RECORD
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
        messageConstants.EXCEPTION
      );
    }
  }
}

module.exports = new UserController();
