import nodemailer from "nodemailer";

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

const sendResetPasswordEmail = async ({ to, customerName, resetUrl }) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `${process.env.APP_NAME} <${process.env.MAIL_FROM}>`,
    to,
    subject: "Yêu cầu đặt lại mật khẩu",
    text: `Xin chào ${customerName}, vui lòng đặt lại mật khẩu tại đây: ${resetUrl}`,
  });
};

export { sendResetPasswordEmail };
