import test from "node:test";
import assert from "node:assert/strict";

import { createAdminUsersService } from "../src/services/adminUsers/adminUsers.service.js";

test("adminUsersService getAdminUsers returns sanitized paginated users", async () => {
  const calls = { findMany: null, count: null };
  const service = createAdminUsersService({
    userDelegate: {
      count: async (args) => {
        calls.count = args;
        return 2;
      },
      findMany: async (args) => {
        calls.findMany = args;
        return [
          { MaKH: 1, TenChuXe: "Admin A", Email: "a@example.com", MatKhau: "secret", ChucVu: "Admin" },
          { MaKH: 2, TenChuXe: "Nhan Vien B", Email: "b@example.com", MatKhau: "secret2", ChucVu: "NhanVien" },
        ];
      },
    },
  });

  const result = await service.getAdminUsers({ page: 2, limit: 5, search: "admin", role: "Admin", status: "HoatDong" });

  assert.equal(calls.count.where.OR.length, 3);
  assert.deepEqual(calls.count.where.ChucVu, "Admin");
  assert.deepEqual(calls.count.where.TrangThai, "HoatDong");
  assert.equal(calls.findMany.skip, 5);
  assert.equal(result.pagination.page, 2);
  assert.equal(result.users[0].MatKhau, undefined);
  assert.equal(result.users[0].roleLabel, "Quản trị viên");
});

test("adminUsersService updateAdminUser updates role and status", async () => {
  const calls = { update: null, findUnique: null };
  const service = createAdminUsersService({
    userDelegate: {
      findUnique: async (args) => {
        calls.findUnique = args;
        return { MaKH: 7, TenChuXe: "User", ChucVu: "NhanVien", TrangThai: "HoatDong" };
      },
      update: async (args) => {
        calls.update = args;
        return { MaKH: 7, TenChuXe: "User", ChucVu: "Admin", TrangThai: "BiKhoa" };
      },
    },
  });

  const result = await service.updateAdminUser(7, { ChucVu: "Admin", TrangThai: "BiKhoa" });

  assert.equal(calls.findUnique.where.MaKH, 7);
  assert.deepEqual(calls.update.data, { ChucVu: "Admin", TrangThai: "BiKhoa" });
  assert.equal(result.ChucVu, "Admin");
});

test("adminUsersService resetAdminUserPassword hashes password and clears reset token fields", async () => {
  const calls = { findUnique: null, update: null, hashPassword: null };
  const service = createAdminUsersService({
    userDelegate: {
      findUnique: async (args) => {
        calls.findUnique = args;
        return {
          MaKH: 8,
          TenChuXe: "User",
          MatKhau: "old-hash",
          TokenDatLaiMatKhau: "token-hash",
          TokenDatLaiMatKhauHetHanLuc: new Date("2026-01-01T00:00:00.000Z"),
          TokenDatLaiMatKhauDaDungLuc: new Date("2026-01-02T00:00:00.000Z"),
        };
      },
      update: async (args) => {
        calls.update = args;
        return {
          MaKH: 8,
          TenChuXe: "User",
          MatKhau: "new-hash",
          TokenDatLaiMatKhau: null,
          TokenDatLaiMatKhauHetHanLuc: null,
          TokenDatLaiMatKhauDaDungLuc: null,
        };
      },
    },
    hashPassword: async (password) => {
      calls.hashPassword = password;
      return "new-hash";
    },
  });

  const result = await service.resetAdminUserPassword(8, {
    MatKhauMoi: "Password123!",
    XacNhanMatKhauMoi: "Password123!",
  });

  assert.equal(calls.findUnique.where.MaKH, 8);
  assert.equal(calls.hashPassword, "Password123!");
  assert.deepEqual(calls.update.data, {
    MatKhau: "new-hash",
    TokenDatLaiMatKhau: null,
    TokenDatLaiMatKhauHetHanLuc: null,
    TokenDatLaiMatKhauDaDungLuc: null,
  });
  assert.equal(result.MatKhau, undefined);
});

test("adminUsersService resetAdminUserPassword rejects password mismatch", async () => {
  const service = createAdminUsersService({
    userDelegate: {
      findUnique: async () => ({ MaKH: 8 }),
    },
  });

  await assert.rejects(
    service.resetAdminUserPassword(8, {
      MatKhauMoi: "Password123!",
      XacNhanMatKhauMoi: "Password456!",
    }),
    (error) => error.status === 400 && error.message === "Mật khẩu xác nhận không khớp.",
  );
});

test("adminUsersService resetAdminUserPassword throws 404 when user is missing", async () => {
  const service = createAdminUsersService({
    userDelegate: {
      findUnique: async () => null,
    },
  });

  await assert.rejects(
    service.resetAdminUserPassword(99, {
      MatKhauMoi: "Password123!",
      XacNhanMatKhauMoi: "Password123!",
    }),
    (error) => error.status === 404 && error.message === "Không tìm thấy tài khoản.",
  );
});
