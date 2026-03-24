import nodemailer from "nodemailer";

import { buildServiceError } from "../../shared/crud/crud.helpers.js";

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
} = {}) => {
  const sendResetPasswordEmail = async ({ to, customerName, resetUrl }) => {
    const trimmedMailFrom = mailFrom?.trim();

    if (!trimmedMailFrom) {
      throw buildServiceError(500, "Thiếu cấu hình MAIL_FROM để gửi email.");
    }

    const transporter = createTransporterFn();
    const trimmedAppName = appName?.trim();

    await transporter.sendMail({
      from: trimmedAppName ? `${trimmedAppName} <${trimmedMailFrom}>` : trimmedMailFrom,
      to,
      subject: "Yêu cầu đặt lại mật khẩu",
      text: `Xin chào ${customerName}, vui lòng đặt lại mật khẩu tại đây: ${resetUrl}`,
    });
  };

  return {
    sendResetPasswordEmail,
  };
};

const { sendResetPasswordEmail } = createMailUtils();

export { createMailUtils, sendResetPasswordEmail };
