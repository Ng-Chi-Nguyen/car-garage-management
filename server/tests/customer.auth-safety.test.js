import test from "node:test";
import assert from "node:assert/strict";

import customerSchema from "../src/validator/management/customer.validator.js";

test("customer create validator từ chối ghi MatKhau trực tiếp", () => {
  const { error } = customerSchema.create.body.validate({
    Email: "khachhang@example.com",
    MatKhau: "Password123!",
    TenChuXe: "Nguyen Van A",
    DienThoai: "0901234567",
    DiaChi: "TP HCM",
  });

  assert.ok(error);
  assert.match(error.details[0].message, /MatKhau/i);
});

test("customer update validator từ chối ghi MatKhau trực tiếp", () => {
  const { error } = customerSchema.update.body.validate({
    MatKhau: "Password123!",
  });

  assert.ok(error);
  assert.match(error.details[0].message, /MatKhau/i);
});
