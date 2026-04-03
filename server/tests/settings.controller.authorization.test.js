import test from "node:test";
import assert from "node:assert/strict";

import settingsController from "../src/controllers/settings.controller.js";
import settingsService from "../src/services/settings/settings.service.js";

const createMockRes = () => ({
  statusCode: 200,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(payload) {
    this.body = payload;
    return this;
  },
});

const withStubbedSettingsService = async (stubs, run) => {
  const originals = {};

  for (const [method, stub] of Object.entries(stubs)) {
    originals[method] = settingsService[method];
    settingsService[method] = stub;
  }

  try {
    await run();
  } finally {
    for (const [method, original] of Object.entries(originals)) {
      settingsService[method] = original;
    }
  }
};

test("settings mutation handlers reject NhanVien before reaching the service", async () => {
  let called = 0;

  await withStubbedSettingsService(
    {
      updateSystemParameters: async () => {
        called += 1;
        return { maxCarsPerDay: 1, materialProfitMargin: 1 };
      },
      createServicePrice: async () => {
        called += 1;
        return { id: 1 };
      },
      updateServicePrice: async () => {
        called += 1;
        return { id: 1 };
      },
      deleteServicePrice: async () => {
        called += 1;
        return { result: true };
      },
    },
    async () => {
      const req = { user: { ChucVu: "NhanVien" }, body: { maxCarsPerDay: 30, materialProfitMargin: 20 } };
      const res = createMockRes();

      await settingsController.updateSystemParameters(req, res);

      assert.equal(res.statusCode, 403);
      assert.equal(called, 0);
    },
  );
});

test("settings mutation handlers allow Admin access", async () => {
  await withStubbedSettingsService(
    {
      updateSystemParameters: async () => ({ maxCarsPerDay: 30, materialProfitMargin: 20 }),
    },
    async () => {
      const req = { user: { ChucVu: "Admin" }, body: { maxCarsPerDay: 30, materialProfitMargin: 20 } };
      const res = createMockRes();

      await settingsController.updateSystemParameters(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(res.body.success, true);
    },
  );
});
