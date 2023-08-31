import nodemailer from "nodemailer";
import config from "../config/config.js";

const sendMail = (mail) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: true,
    port: 587,
    auth: {
      user: config.gmailAddress,
      pass: config.gmailPassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  transporter.sendMail(mail);
};

export default sendMail;
