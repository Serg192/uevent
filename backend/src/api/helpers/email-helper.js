const nodemailer = require("nodemailer");
const handlebars = require("nodemailer-express-handlebars");
const path = require("path");
const logger = require("../../config/logger");

const VERIFY_EMAIL_TEMPLATE = "verify-email";
const RESET_PASSWORD_TEMPLATE = "reset-password";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

transporter.use(
  "compile",
  handlebars({
    viewEngine: {
      extname: ".handlebars",
      layoutsDir: path.join(__dirname, "../templates/layouts"),
      partialsDir: path.join(__dirname, "../templates/partials"),
      defaultLayout: false,
    },
    viewPath: path.join(__dirname, "../templates/layouts"),
  })
);

async function sendEmail(to, subject, template, context) {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: to,
    subject: subject,
    template: template,
    context: context,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to '${to}', ${info.response}`);
  } catch (error) {
    logger.error(`Error sending email: ${error}`);
  }
}

module.exports = {
  sendEmail,
  VERIFY_EMAIL_TEMPLATE,
  RESET_PASSWORD_TEMPLATE,
};
