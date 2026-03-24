import test from "node:test";
import assert from "node:assert/strict";

import {
  sanitizeCustomer,
  sanitizeCustomerListResult,
} from "../src/services/management/customer.service.js";

test("sanitizeCustomer loại bỏ mật khẩu và reset token fields", () => {
  const result = sanitizeCustomer({
    MaKH: 1,
    Email: "khachhang@example.com",
    MatKhau: "hashed-password",
    TokenDatLaiMatKhau: "hashed-reset-token",
    TokenDatLaiMatKhauHetHanLuc: new Date("2026-03-24T00:00:00.000Z"),
    TokenDatLaiMatKhauDaDungLuc: new Date("2026-03-23T00:00:00.000Z"),
    TenChuXe: "Nguyen Van A",
  });

  assert.equal(result.MatKhau, undefined);
  assert.equal(result.TokenDatLaiMatKhau, undefined);
  assert.equal(result.TokenDatLaiMatKhauHetHanLuc, undefined);
  assert.equal(result.TokenDatLaiMatKhauDaDungLuc, undefined);
  assert.equal(result.TenChuXe, "Nguyen Van A");
});

test("sanitizeCustomerListResult loại bỏ dữ liệu nhạy cảm khỏi danh sách khách hàng", () => {
  const result = sanitizeCustomerListResult({
    customers: [
      {
        MaKH: 1,
        Email: "khachhang@example.com",
        MatKhau: "hashed-password",
        TokenDatLaiMatKhau: "hashed-reset-token",
        TenChuXe: "Nguyen Van A",
      },
    ],
    pagination: {
      page: 1,
      limit: 10,
      totalItems: 1,
      totalPages: 1,
    },
  });

  assert.equal(result.customers[0].MatKhau, undefined);
  assert.equal(result.customers[0].TokenDatLaiMatKhau, undefined);
  assert.equal(result.pagination.totalItems, 1);
});
