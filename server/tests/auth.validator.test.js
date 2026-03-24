import test from "node:test";
import assert from "node:assert/strict";

const loadAuthSchema = async () => {
  const module = await import("../src/validator/auth/auth.validator.js");
  return module.default;
};

test("auth register validator chấp nhận payload hợp lệ", async () => {
  const authSchema = await loadAuthSchema();

  const { error, value } = authSchema.register.body.validate({
    Email: "khachhang@example.com",
    MatKhau: "Password123!",
    XacNhanMatKhau: "Password123!",
    TenChuXe: "Nguyen Van A",
    DienThoai: "0901234567",
    DiaChi: "TP HCM",
  });

  assert.equal(error, undefined);
  assert.equal(value.Email, "khachhang@example.com");
});

test("auth register validator từ chối khi xác nhận mật khẩu không khớp", async () => {
  const authSchema = await loadAuthSchema();

  const { error } = authSchema.register.body.validate({
    Email: "khachhang@example.com",
    MatKhau: "Password123!",
    XacNhanMatKhau: "Password456!",
    TenChuXe: "Nguyen Van A",
    DienThoai: "0901234567",
    DiaChi: "TP HCM",
  });

  assert.ok(error);
  assert.match(error.details[0].message, /XacNhanMatKhau/i);
});

test("auth forgot-password validator bắt buộc email hợp lệ", async () => {
  const authSchema = await loadAuthSchema();

  const { error } = authSchema.forgotPassword.body.validate({
    Email: "khong-phai-email",
  });

  assert.ok(error);
  assert.match(error.details[0].message, /Email/i);
});

test("auth reset-password validator yêu cầu token và mật khẩu mới hợp lệ", async () => {
  const authSchema = await loadAuthSchema();

  const { error } = authSchema.resetPassword.body.validate({
    Token: "",
    MatKhauMoi: "123",
    XacNhanMatKhauMoi: "456",
  });

  assert.ok(error);
  assert.ok(error.details.length >= 2);
});

test("auth change-password validator chấp nhận payload hợp lệ", async () => {
  const authSchema = await loadAuthSchema();

  const { error } = authSchema.changePassword.body.validate({
    MatKhauHienTai: "Password123!",
    MatKhauMoi: "Password456!",
    XacNhanMatKhauMoi: "Password456!",
  });

  assert.equal(error, undefined);
});
