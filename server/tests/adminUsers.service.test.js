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

test("adminUsersService createAdminUser validates uniqueness, hashes password, and sanitizes response", async () => {
  const calls = { findFirst: [], create: null, hashPassword: null };
  const service = createAdminUsersService({
    userDelegate: {
      findFirst: async (args) => {
        calls.findFirst.push(args);
        return null;
      },
      create: async (args) => {
        calls.create = args;
        return {
          MaKH: 9,
          TenChuXe: "New User",
          DienThoai: "0900000000",
          Email: "new@example.com",
          MatKhau: "hashed-password",
          ChucVu: "NhanVien",
          TrangThai: "HoatDong",
          TokenDatLaiMatKhau: "secret",
        };
      },
    },
    hashPassword: async (password) => {
      calls.hashPassword = password;
      return "hashed-password";
    },
  });

  const result = await service.createAdminUser({
    TenChuXe: "New User",
    DienThoai: "0900000000",
    Email: "new@example.com",
    MatKhau: "Password123!",
    XacNhanMatKhau: "Password123!",
    DiaChi: "Hà Nội",
    ChucVu: "NhanVien",
  });

  assert.equal(calls.findFirst.length, 2);
  assert.deepEqual(calls.findFirst[0], { where: { Email: "new@example.com" } });
  assert.deepEqual(calls.findFirst[1], { where: { DienThoai: "0900000000" } });
  assert.equal(calls.hashPassword, "Password123!");
  assert.deepEqual(calls.create.data, {
    TenChuXe: "New User",
    DienThoai: "0900000000",
    Email: "new@example.com",
    MatKhau: "hashed-password",
    DiaChi: "Hà Nội",
    ChucVu: "NhanVien",
    TrangThai: "HoatDong",
  });
  assert.equal(result.MatKhau, undefined);
  assert.equal(result.TokenDatLaiMatKhau, undefined);
});

test("adminUsersService createAdminUser rejects duplicate email, duplicate phone, and password mismatch", async () => {
  const duplicateEmailService = createAdminUsersService({
    userDelegate: {
      findFirst: async (args) => (args.where.Email ? { MaKH: 1 } : null),
    },
  });

  await assert.rejects(
    duplicateEmailService.createAdminUser({
      TenChuXe: "New User",
      DienThoai: "0900000000",
      Email: "dup@example.com",
      MatKhau: "Password123!",
      XacNhanMatKhau: "Password123!",
      ChucVu: "NhanVien",
    }),
    (error) => error.status === 409 && error.message === "Email đã tồn tại.",
  );

  const duplicatePhoneService = createAdminUsersService({
    userDelegate: {
      findFirst: async (args) => (args.where.DienThoai ? { MaKH: 2 } : null),
    },
  });

  await assert.rejects(
    duplicatePhoneService.createAdminUser({
      TenChuXe: "New User",
      DienThoai: "0900000000",
      Email: "new@example.com",
      MatKhau: "Password123!",
      XacNhanMatKhau: "Password123!",
      ChucVu: "NhanVien",
    }),
    (error) => error.status === 409 && error.message === "Số điện thoại đã tồn tại.",
  );

  const mismatchService = createAdminUsersService({
    userDelegate: {
      findFirst: async () => null,
    },
  });

  await assert.rejects(
    mismatchService.createAdminUser({
      TenChuXe: "New User",
      DienThoai: "0900000000",
      Email: "new@example.com",
      MatKhau: "Password123!",
      XacNhanMatKhau: "Password456!",
      ChucVu: "NhanVien",
    }),
    (error) => error.status === 400 && error.message === "Mật khẩu xác nhận không khớp.",
  );
});
