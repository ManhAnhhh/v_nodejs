const nodemailer = require("nodemailer");
const config = require("config");
// const mail = config.get("mail");
const transporter = nodemailer.createTransport(config.get("mail"));

module.exports = transporter;
