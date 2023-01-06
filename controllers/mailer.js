"use strict";
const nodemailer = require("nodemailer");
require("dotenv").config();

// async..await is not allowed in global scope, must use a wrapper
async function mailer(email) {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"Grocery List App" <${process.env.GMAIL_EMAIL}>`, // sender address
    to: email, // list of receivers
    subject: "You have been invited to use a list!", // Subject line
    text: `Hello ${email},
    you have been invited to use a list!
    Sign up at:
    https://grocery-list-production.up.railway.app/
    `, // plain text body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

// main().catch(console.error);
module.exports = mailer;
