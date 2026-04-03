import test from "node:test";
import assert from "node:assert/strict";

import adminUsersController from "../src/controllers/adminUsers.controller.js";
import adminUsersService from "../src/services/adminUsers/adminUsers.service.js";

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

const withStubbedAdminUsersService = async (stubs, run) => {
  const originals = {};

  for (const [method, stub] of Object.entries(stubs)) {
    originals[method] = adminUsersService[method];
    adminUsersService[method] = stub;
  }

  try {
    await run();
  } finally {
    for (const [method, original] of Object.entries(originals)) {
      adminUsersService[method] = original;
    }
  }
};

test("admin users mutation handlers reject NhanVien before reaching the service", async () => {
  let called = 0;

  await withStubbedAdminUsersService(
    {
      createAdminUser: async () => {
        called += 1;
        return { MaKH: 1 };
      },
    },
    async () => {
      const req = { user: { ChucVu: "NhanVien" }, body: { Email: "admin@example.com" } };
      const res = createMockRes();

      await adminUsersController.createAdminUser(req, res);

      assert.equal(res.statusCode, 403);
      assert.equal(called, 0);
    },
  );
});

test("admin users mutation handlers allow Admin access", async () => {
  await withStubbedAdminUsersService(
    {
      createAdminUser: async () => ({ MaKH: 1 }),
    },
    async () => {
      const req = { user: { ChucVu: "Admin" }, body: { Email: "admin@example.com" } };
      const res = createMockRes();

      await adminUsersController.createAdminUser(req, res);

      assert.equal(res.statusCode, 201);
      assert.equal(res.body.success, true);
    },
  );
});
