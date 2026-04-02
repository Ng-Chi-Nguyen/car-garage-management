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

  const result = await service.getAdminUsers({ page: 2, limit: 5, search: "admin" });

  assert.equal(calls.count.where.OR.length, 4);
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
