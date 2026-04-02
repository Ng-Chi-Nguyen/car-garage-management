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
