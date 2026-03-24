import test from "node:test";
import assert from "node:assert/strict";

const loadCreateMailUtils = async () => {
  const module = await import("../src/utils/auth/mail.util.js");
  return module.createMailUtils;
};

test("sendResetPasswordEmail throw lỗi rõ ràng khi thiếu MAIL_FROM", async () => {
  const createMailUtils = await loadCreateMailUtils();
  const mailUtils = createMailUtils({
    createTransporter: () => ({
      sendMail: async () => {},
    }),
    appName: "Car Fix",
    mailFrom: "",
  });

  await assert.rejects(
    () =>
      mailUtils.sendResetPasswordEmail({
        to: "user@example.com",
        customerName: "Nguyen Van A",
        resetUrl: "http://localhost/reset-password?token=abc",
      }),
    (error) => error.status === 500 && /MAIL_FROM/i.test(error.message),
  );
});

test("sendResetPasswordEmail fallback from về MAIL_FROM khi thiếu APP_NAME", async () => {
  const createMailUtils = await loadCreateMailUtils();
  const sentMessages = [];
  const mailUtils = createMailUtils({
    createTransporter: () => ({
      sendMail: async (payload) => {
        sentMessages.push(payload);
      },
    }),
    appName: "",
    mailFrom: " noreply@example.com ",
  });

  await mailUtils.sendResetPasswordEmail({
    to: "user@example.com",
    customerName: "Nguyen Van A",
    resetUrl: "http://localhost/reset-password?token=abc",
  });

  assert.equal(sentMessages[0].from, "noreply@example.com");
});
