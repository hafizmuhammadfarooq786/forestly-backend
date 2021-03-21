"use strict";
const Accounts = require("./../models/Accounts");

module.exports = {
  /* find an account */
  isExist: async (emailAddress) => {
    try {
      return Accounts.exists({ email: emailAddress });
    } catch (error) {
      return error;
    }
  },

  /* find an account and return record */
  isExistReturnAccount: async (emailAddress) => {
    let user;
    try {
      await Accounts.findOne({ email: emailAddress }, function (err, data) {
        if (err) {
          user = {};
          console.log("failed to find user");
        } else {
          user = data;
        }
      });
      return user;
    } catch (error) {
      return error;
    }
  },

  /* Create new account */
  signup: async (accountData) => {
    let status;
    try {
      await Accounts.create(accountData, function (err, data) {
        if (err) {
          status = false;
          console.log("failed to signup");
        } else {
          status = true;
        }
      }).promise();
      return status;
    } catch (error) {
      return error;
    }
  },

  /* Reset password */
  resetPassword: async (data) => {
    try {
      const updatedAccount = await Accounts.findOneAndUpdate(
        { email: data.email },
        { password: data.password },
        { new: true }
      )
        .then((account) => {
          return account;
        })
        .catch((err) => {
          return false;
        });

      if (updatedAccount) {
        return updatedAccount;
      } else {
        console.log("Query failed");
        return false;
      }
    } catch (error) {
      return error;
    }
  },

  /* Delete account */
  deleteAccount: async (id) => {
    try {
      const deletedAccount = await Accounts.findOneAndDelete({
        accountId: id,
      })
        .then((account) => {
          return account;
        })
        .catch((err) => {
          return false;
        });

      if (deletedAccount) {
        return true;
      } else {
        console.log("Query failed");
        return false;
      }
    } catch (error) {
      return error;
    }
  },

  isEmailConfirmed: async (email) => {
    try {
      await Accounts.updateOne(
        { email: email },
        {
          $set: {
            isConfirmed: true,
          },
        },
        (error, result) => {
          if (result.length != 0) {
            return true;
          } else {
            return false;
          }
        }
      );
    } catch (error) {
      return error;
    }
  },
};
