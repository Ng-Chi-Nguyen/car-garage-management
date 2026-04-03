import test from "node:test";
import assert from "node:assert/strict";

import { createAuthService } from "../services/auth/auth.service.js";

const createLoginService = (customer) =>
  createAuthService({
    customerDelegate: {
      findUnique: async () => customer,
    },
    comparePassword: async () => true,
    signAccessToken: (payload) => payload,
  });

test("allows Admin login", async () => {
  const service = createLoginService({
    MaKH: 1,
    Email: "admin@example.com",
    MatKhau: "hashed",
    ChucVu: "Admin",
    TrangThai: "HoatDong",
  });

  const result = await service.login({ Email: "admin@example.com", MatKhau: "secret" });

  assert.equal(result.accessToken.ChucVu, "Admin");
});

test("allows NhanVien login", async () => {
  const service = createLoginService({
    MaKH: 2,
    Email: "staff@example.com",
    MatKhau: "hashed",
    ChucVu: "NhanVien",
    TrangThai: "HoatDong",
  });

  const result = await service.login({ Email: "staff@example.com", MatKhau: "secret" });

  assert.equal(result.accessToken.ChucVu, "NhanVien");
});

test("rejects KhachHang login", async () => {
  const service = createLoginService({
    MaKH: 3,
    Email: "customer@example.com",
    MatKhau: "hashed",
    ChucVu: "KhachHang",
    TrangThai: "HoatDong",
  });

  await assert.rejects(
    () => service.login({ Email: "customer@example.com", MatKhau: "secret" }),
    (error) => error.status === 403 && error.message === "Tài khoản không có quyền truy cập hệ thống nội bộ",
  );
});
