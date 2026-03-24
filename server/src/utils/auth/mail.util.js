import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

import nodemailer from "nodemailer";
import ejs from "ejs";

import { buildServiceError } from "../../shared/crud/crud.helpers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MAIL_TEMPLATE_DIR = path.join(__dirname, "../../templates/mail");

const renderTemplateFile = async (templateFileName, data) => {
  const templatePath = path.join(MAIL_TEMPLATE_DIR, templateFileName);
  const template = await fs.readFile(templatePath, "utf8");
  return ejs.render(template, data, { filename: templatePath });
};

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: Number(process.env.MAIL_PORT) === 465,
    auth: process.env.MAIL_USER
      ? {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      }
      : undefined,
  });

const createMailUtils = ({
  createTransporter: createTransporterFn = createTransporter,
  appName = process.env.APP_NAME,
  mailFrom = process.env.MAIL_FROM,
  renderTemplate = renderTemplateFile,
} = {}) => {
  const getResolvedFrom = () => {
    const trimmedMailFrom = mailFrom?.trim();

    if (!trimmedMailFrom) {
      throw buildServiceError(500, "Thiếu cấu hình MAIL_FROM để gửi email.");
    }

    const trimmedAppName = appName?.trim();

    return trimmedAppName ? `${trimmedAppName} <${trimmedMailFrom}>` : trimmedMailFrom;
  };

  const sendResetPasswordEmail = async ({ to, customerName, resetUrl }) => {
    const transporter = createTransporterFn();
    const resolvedAppName = appName?.trim() || "Car Fix";
    const subject = "Yêu cầu đặt lại mật khẩu";
    const bodyHtml = await renderTemplate("reset-password-email.ejs", {
      customerName,
      resetUrl,
    });
    const html = await renderTemplate("layout.ejs", {
      appName: resolvedAppName,
      subject,
      previewText: `Đặt lại mật khẩu cho tài khoản của ${customerName}`,
      bodyHtml,
    });

    await transporter.sendMail({
      from: getResolvedFrom(),
      to,
      subject,
      html,
      text: `Xin chào ${customerName}, vui lòng đặt lại mật khẩu tại đây: ${resetUrl}`,
    });
  };

  const sendWelcomeEmail = async ({ to, customerName }) => {
    const transporter = createTransporterFn();
    const resolvedAppName = appName?.trim() || "Car Fix";
    const subject = "Chào mừng bạn đến với Car Fix";
    const bodyHtml = await renderTemplate("welcome-email.ejs", {
      customerName,
    });
    const html = await renderTemplate("layout.ejs", {
      appName: resolvedAppName,
      subject,
      previewText: `Tài khoản của ${customerName} đã được tạo thành công`,
      bodyHtml,
    });

    await transporter.sendMail({
      from: getResolvedFrom(),
      to,
      subject,
      html,
      text: `Xin chào ${customerName}, tài khoản của bạn đã được tạo thành công. Chào mừng bạn đến với Car Fix.`,
    });
  };

  return {
    sendResetPasswordEmail,
    sendWelcomeEmail,
  };
};

const { sendResetPasswordEmail, sendWelcomeEmail } = createMailUtils();

export { createMailUtils, sendResetPasswordEmail, sendWelcomeEmail };
