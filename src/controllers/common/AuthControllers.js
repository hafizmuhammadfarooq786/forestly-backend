"use strict";
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const constants = require("../../constants/Statuses");
const messageConstants = require("../../utils/messageConstants.js");
const responseService = require("../../services/responseService");
const system = require("../../services/messageService");
const {
  generateAccessToken,
  generateRefreshToken,
  generateAccessTokenForConfirmation,
} = require("../../services/jwtService");
const {
  isExist,
  isExistReturnAccount,
  signup,
  resetPassword,
  deleteAccount,
  isEmailConfirmed,
} = require("../../resolvers/Accounts");

class AuthController {
  /* Authentication */
  async login(data) {
    if (!data.email || !data.password) {
      return responseService.createResponse(
        constants.STATUS.ERROR,
        data,
        messageConstants.DATA_MISSING
      );
    }
    try {
      var user = await isExistReturnAccount(data.email);
      if (user) {
        const params = {
          accountType: user.accountType,
          createdAt: user.createdAt,
          accountId: user.accountId,
          email: user.email,
          source: user.source,
        };

        const access = await generateAccessToken(params);
        const refresh = await generateRefreshToken(params);

        return new Promise(function (resolve, reject) {
          bcrypt.compare(data.password, user.password, function (err, result) {
            if (result == true) {
              return resolve(
                responseService.createResponse(
                  constants.STATUS.SUCCESS,
                  { user: params, access, refresh },
                  messageConstants.LOGIN
                )
              );
            } else {
              return resolve(
                responseService.createResponse(
                  constants.STATUS.ERROR,
                  [],
                  messageConstants.INVALID
                )
              );
            }
          });
        });
      } else {
        return responseService.createResponse(
          constants.STATUS.ERROR,
          [],
          messageConstants.INVALID
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

  /* Signup new account */
  async signup(data) {
    if (!data.email || !data.password || !data.accountType || !data.source) {
      return responseService.createResponse(
        constants.STATUS.ERROR,
        data,
        messageConstants.DATA_MISSING
      );
    }

    const isEmailExist = await isExist(data.email);
    if (isEmailExist) {
      return responseService.createResponse(
        constants.STATUS.ERROR,
        {},
        messageConstants.EMAIL_EXIST
      );
    } else {
      try {
        const saltRounds = 10;
        let encryptPassword = new Promise(function (resolve, reject) {
          return bcrypt.hash(data.password, saltRounds, function (err, hash) {
            if (!err) {
              return resolve(hash);
            }
          });
        });
        data.password = await encryptPassword;

        var params = {
          accountId: uuidv4(),
          ...data,
          createdAt: moment().format("L"),
          updatedAt: moment().format("L"),
        };

        const user = await signup(params);
        if (user) {
          const access = await generateAccessTokenForConfirmation(params);
          system.sendEmail(params.email, access);
          return responseService.createResponse(
            constants.STATUS.SUCCESS,
            {},
            messageConstants.ACCOUNT_CREATED
          );
        } else {
          return responseService.createResponse(
            constants.STATUS.ERROR,
            data,
            messageConstants.ACCOUNT_CREATION_ERROR
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

  /* Forgot password */
  async forgotPassword(data) {
    if (!data.email) {
      return responseService.createResponse(
        constants.STATUS.ERROR,
        data,
        messageConstants.INVALID_EMAIL
      );
    }

    try {
      const isEmailExist = await isExist(data.email);
      if (isEmailExist) {
        const access = await generateAccessTokenForConfirmation(data);
        system.forgotPasswordEmail(data.email, access);
        return responseService.createResponse(
          constants.STATUS.SUCCESS,
          {},
          messageConstants.EMAIL_EXIST
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

  /* Reset password */
  async resetPassword(data) {
    if (!data.email || !data.password) {
      return responseService.createResponse(
        constants.STATUS.ERROR,
        data,
        messageConstants.DATA_MISSING
      );
    }
    try {
      const isEmailExist = await isExist(data.email);
      if (isEmailExist) {
        const saltRounds = 10;
        let encryptPassword = new Promise(function (resolve, reject) {
          return bcrypt.hash(data.password, saltRounds, function (err, hash) {
            if (!err) {
              return resolve(hash);
            }
          });
        });
        data.password = await encryptPassword;
        data.updatedAt = moment().format("L");
        const resetAccount = await resetPassword(data);

        if (resetAccount) {
          system.sendUpdatedPasswordMessage();
          return responseService.createResponse(
            constants.STATUS.SUCCESS,
            {},
            messageConstants.PASSWORD_CHANGED
          );
        } else {
          return responseService.createResponse(
            constants.STATUS.ERROR,
            data,
            messageConstants.PASSWORD_CHANGED_FAILED
          );
        }
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

  /* Delete Account */
  async deleteAccount(data) {
    if (!data.accountId) {
      return responseService.createResponse(
        constants.STATUS.ERROR,
        data,
        messageConstants.DATA_MISSING
      );
    }
    try {
      const user = await deleteAccount(data.accountId);

      if (user)
        return responseService.createResponse(
          constants.STATUS.SUCCESS,
          {},
          messageConstants.RECORD_DELETED
        );
      else {
        return responseService.createResponse(
          constants.STATUS.ERROR,
          "Failed to delete",
          messageConstants.RECORD_FAILED_TO_DELETE
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

  /* email address confirmation */
  async emailTokenConfirmation(data) {
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
        await isEmailConfirmed(data.email);
        const params = {
          accountType: user.accountType,
          createdAt: user.createdAt,
          accountId: user.accountId,
          email: user.email,
          source: user.source,
        };
        const access = await generateAccessToken(params);
        const refresh = await generateRefreshToken(params);
        return responseService.createResponse(
          constants.STATUS.SUCCESS,
          { user: params, access, refresh },
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

  /* reset password email confirmation */
  async resetEmailTokenConfirmation(data) {
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
          email: user.email,
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

module.exports = new AuthController();
