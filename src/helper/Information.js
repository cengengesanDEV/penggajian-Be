const nodemailer = require("nodemailer");
const { google } = require("googleapis");
// const fs = require("fs");
const { readFileSync } = require("fs");
const mustache = require("mustache");
const path = require("path");

const clientId = '24996754458-1lf80bnln4h2mddq8f9qedsfb0juq6v4.apps.googleusercontent.com';
const clientSecret = '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';
const refreshToken = process.env.refresh_token_google;

const { OAuth2 } = google.auth;
const OAuth2Client = new OAuth2(
  clientId,
  clientSecret,
  "https://developers.google.com/oauthplayground"
);
OAuth2Client.setCredentials({
  refresh_token: refreshToken,
});

module.exports = {
  sendInformation: (data) =>
    new Promise((resolve, reject) => {
      const accessToken = OAuth2Client.getAccessToken;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "nyengircengengesan@gmail.com",
          clientId,
          clientSecret,
          refreshToken,
          accessToken,
        },
      });

      const fileTemplate = readFileSync(
        path.join(__dirname, "..", "templates", `${data.template}`),
        "utf8"
      );

      const mailOptions = {
        from: '"Penggajian" <nyengircengengesan@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        html: mustache.render(fileTemplate, { ...data }),
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error)
          reject(error);
        } else {
          resolve(info);
        }
      });
    }),
};