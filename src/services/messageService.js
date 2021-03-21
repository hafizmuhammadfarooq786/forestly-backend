const config = require("../config/config.json");
const sendgridMail = require("@sendgrid/mail");
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

class System {
  // Generate Password
  generatePassword() {
    var passwordChars = config.PASSWORD_CHARS;
    var passwordLength = Math.floor(Math.random() * 5) + 8;
    var randomPassword = Array(passwordLength)
      .fill(passwordChars)
      .map(function (password) {
        return password[Math.floor(Math.random() * password.length)];
      })
      .join("");
    return randomPassword;
  }

  sendSignupMessage() {
    const sendCodeString = `{Thank you for joining https://forest.ly, Wr tried to provide you the best services you need. }`;
    client.messages.create({
      to: "+923134044978",
      from: process.env.TWILIO_SENDER_NUMBER,
      body: sendCodeString,
    });
  }

  /* Send OTP Code to provided number */
  sendOTPCode() {
    const otpCode = this.generateCode();
    const sendCodeString = `{Your OTP Verification Code for https://forest.ly is: ${otpCode} }`;
    client.messages.create({
      to: "+923134044978",
      from: process.env.TWILIO_SENDER_NUMBER,
      body: sendCodeString,
    });
  }

  /* Send Message when password updated successfully */
  sendUpdatedPasswordMessage() {
    const sendCodeString = `{Congratulations, your password has been updated successfull. Please login using this link https://forest.ly/login }`;
    client.messages.create({
      to: "+923134044978",
      from: process.env.TWILIO_SENDER_NUMBER,
      body: sendCodeString,
    });
  }

  // Generate Code
  generateCode() {
    var passwordChars = config.PASSWORD_CHARS;
    var codeLength = Math.floor(Math.random()) + 5;
    var randomCode = Array(codeLength)
      .fill(passwordChars)
      .map(function (code) {
        return code[Math.floor(Math.random() * code.length)];
      })
      .join("");
    return randomCode;
  }

  // Send Email using Gmail Client
  sendEmail(email, code) {
    const companyURL = "https://forest.ly";
    const link = process.env.APP_URL + "/confirm-email-address?token=" + code;
    const mail = {
      from: "Hafiz Muhammad Farooq <farooq@we-over-i.com>",
      to: email,
      subject: "Please verify your email address",
      html:
        "Hello " +
        email +
        ",<br><br>You've registered an account on <a href=" +
        companyURL +
        ">Forest.ly</a>, before being able to use your account you need to verify that this is your email address by clicking here<br><br><br><a href=" +
        link +
        " style='font-size: 16px; text-decoration: none;padding: 18px 56px; background-color: #274B28; color: white; border-radius: 12px; '>Verify now</a><br><br><br>",
    };
    (async () => {
      try {
        await sendgridMail.send(mail);
      } catch (error) {
        if (error.response) {
          console.error(error.response.body);
        }
      }
    })();
  }

  forgotPasswordEmail(email, code) {
    const link =
      process.env.APP_URL + "/reset-password-confirmarion?reset_code=" + code;
    const mail = {
      from: "Hafiz Muhammad Farooq <farooq@we-over-i.com>",
      to: email,
      subject: "RESET PASSWORD",
      html:
        "Reset your password<br><br>Need to reset your account? No problem! Just click the button below and you'll be on your way. if you did not make this request, please ignore this email. <br><br><br><a href=" +
        link +
        " style='font-size: 16px; text-decoration: none;padding: 18px 56px; background-color: #274B28; color: white; border-radius: 12px; '>Reset your password </a><br><br><br><br>",
    };
    (async () => {
      try {
        await sendgridMail.send(mail);
      } catch (error) {
        if (error.response) {
          console.error(error.response.body);
        }
      }
    })();
  }
}
module.exports = new System();
