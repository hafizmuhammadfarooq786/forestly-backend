"use strict";
const statusCode = require("../constants/Statuses");
const logService = require("./logs");

class ResponseService {
  async createResponse(status, responseData, message) {
    logService.display(responseData);
    let responseObj;

    if (status === "SUCCESS") {
      responseObj = {
        metadata: {
          status: status,
          message: message,
          code: statusCode.CODE.OK,
        },
        payload: responseData,
      };
    } else if (status === "FAILURE") {
      responseObj = {
        metadata: {
          status: status,
          message: message,
          code: statusCode.CODE.OK,
        },
        payload: responseData,
      };
    } else {
      responseObj = {
        metadata: {
          status: status,
          message: message,
          code: statusCode.CODE.OK,
        },
        payload: responseData,
      };
    }

    return responseObj;
  }
}

module.exports = new ResponseService();
