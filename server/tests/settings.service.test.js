import test from "node:test";
import assert from "node:assert/strict";

import { createSettingsService } from "../src/services/settings/settings.service.js";

test("settingsService getSystemParameters trả về giá trị đã lưu", async () => {
  const service = createSettingsService({
    settingsDelegate: {
      findUnique: async () => ({
        MaCauHinh: 1,
        SoXeToiDaMoiNgay: 24,
        TyLeLoiNhuanPhuTung: 20,
      }),
      upsert: async () => {
        throw new Error("not used");
      },
    },
  });

  const result = await service.getSystemParameters();

  assert.deepEqual(result, {
    maxCarsPerDay: 24,
    materialProfitMargin: 20,
  });
});

test("settingsService updateSystemParameters lưu cấu hình mới", async () => {
  const calls = { upsert: null };
  const service = createSettingsService({
    settingsDelegate: {
      findUnique: async () => null,
      upsert: async (args) => {
        calls.upsert = args;
        return {
          MaCauHinh: 1,
          SoXeToiDaMoiNgay: 30,
          TyLeLoiNhuanPhuTung: 25,
        };
      },
    },
  });

  const result = await service.updateSystemParameters({
    maxCarsPerDay: 30,
    materialProfitMargin: 25,
  });

  assert.equal(calls.upsert.create.SoXeToiDaMoiNgay, 30);
  assert.equal(calls.upsert.update.TyLeLoiNhuanPhuTung, 25);
  assert.deepEqual(result, {
    maxCarsPerDay: 30,
    materialProfitMargin: 25,
  });
});

test("settingsService getCarBrands dùng số lượng xe từ relation count", async () => {
  const calls = { findMany: null };
  const service = createSettingsService({
    carBrandDelegate: {
      findMany: async (args) => {
        calls.findMany = args;
        return [
          {
            MaHieuXe: 5,
            TenHieuXe: "Toyota",
            _count: { Xe: 4 },
            Xe: [{}, {}],
          },
        ];
      },
    },
  });

  const result = await service.getCarBrands();

  assert.deepEqual(calls.findMany.include, {
    _count: {
      select: {
        Xe: true,
      },
    },
  });
  assert.equal(result[0].modelCount, 4);
});

test("settingsService dùng delegate Prisma thay thế khi tên model khác", async () => {
  const service = createSettingsService({
    prisma: {
      cauHinhHeThong: {
        findUnique: async () => ({
          MaCauHinh: 1,
          SoXeToiDaMoiNgay: 18,
          TyLeLoiNhuanPhuTung: 12,
        }),
      },
    },
  });

  const result = await service.getSystemParameters();

  assert.deepEqual(result, {
    maxCarsPerDay: 18,
    materialProfitMargin: 12,
  });
});

test("settingsService trả lỗi rõ ràng khi không tìm thấy model cấu hình", async () => {
  const service = createSettingsService({
    prisma: {},
  });

  await assert.rejects(
    service.getSystemParameters(),
    (error) => error.status === 500 && error.message === "Không tìm thấy model cấu hình hệ thống trong Prisma client.",
  );
});

test("settingsService bọc lỗi timeout DB bằng thông báo ngắn gọn", async () => {
  const service = createSettingsService({
    settingsDelegate: {
      findUnique: async () => {
        throw new Error("Prisma MariaDB pool timeout (active=0 idle=0 limit=10)");
      },
    },
  });

  await assert.rejects(
    service.getSystemParameters(),
    (error) => error.status === 503 && error.message === "Hệ thống đang quá tải hoặc không thể kết nối cơ sở dữ liệu. Vui lòng thử lại sau.",
  );
});

test("settingsService createServicePrice tạo mới hạng mục tiền công", async () => {
  const calls = { create: null };
  const service = createSettingsService({
    laborFeeDelegate: {
      findMany: async () => [],
      create: async (args) => {
        calls.create = args;
        return {
          MaTienCong: 99,
          NoiDung: "Cân chỉnh thước lái",
          DonGia: 350000,
        };
      },
    },
  });

  const result = await service.createServicePrice({
    name: "Cân chỉnh thước lái",
    price: 350000,
  });

  assert.equal(calls.create.data.NoiDung, "Cân chỉnh thước lái");
  assert.equal(calls.create.data.DonGia, 350000);
  assert.equal(result.id, 99);
  assert.equal(result.name, "Cân chỉnh thước lái");
  assert.equal(result.price, 350000);
});

test("settingsService updateServicePrice cập nhật hạng mục tiền công", async () => {
  const calls = { update: null };
  const service = createSettingsService({
    laborFeeDelegate: {
      findMany: async () => [],
      update: async (args) => {
        calls.update = args;
        return {
          MaTienCong: 5,
          NoiDung: "Thay dầu động cơ",
          DonGia: 200000,
        };
      },
    },
  });

  const result = await service.updateServicePrice(5, {
    name: "Thay dầu động cơ",
    price: 200000,
  });

  assert.equal(calls.update.where.MaTienCong, 5);
  assert.equal(calls.update.data.NoiDung, "Thay dầu động cơ");
  assert.equal(calls.update.data.DonGia, 200000);
  assert.equal(result.id, 5);
  assert.equal(result.price, 200000);
});

test("settingsService deleteServicePrice chặn xóa khi đã có dữ liệu chi tiết sửa chữa", async () => {
  const service = createSettingsService({
    laborFeeDelegate: {
      delete: async () => ({ MaTienCong: 7 }),
    },
    repairOrderDetailDelegate: {
      count: async () => 3,
    },
  });

  await assert.rejects(
    service.deleteServicePrice(7),
    (error) => error.status === 409
      && error.message === "Không thể xóa hạng mục tiền công vì đã phát sinh dữ liệu sửa chữa liên quan.",
  );
});

test("settingsService deleteServicePrice xóa thành công khi không có dữ liệu liên quan", async () => {
  const calls = { count: null, delete: null };
  const service = createSettingsService({
    laborFeeDelegate: {
      delete: async (args) => {
        calls.delete = args;
        return { MaTienCong: 8 };
      },
    },
    repairOrderDetailDelegate: {
      count: async (args) => {
        calls.count = args;
        return 0;
      },
    },
  });

  const result = await service.deleteServicePrice(8);

  assert.equal(calls.count.where.MaTienCong, 8);
  assert.equal(calls.delete.where.MaTienCong, 8);
  assert.equal(result.deleted, true);
  assert.equal(result.id, 8);
});
