import test from "node:test";
import assert from "node:assert/strict";

const loadCreateAuthController = async () => {
  const module = await import("../src/controllers/auth/auth.controller.js");
  return module.createAuthController;
};

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

test("auth controller register gọi service và trả response 201 chuẩn", async () => {
  const createAuthController = await loadCreateAuthController();
  let receivedPayload = null;
  const authController = createAuthController({
    register: async (payload) => {
      receivedPayload = payload;
      return { customer: { MaKH: 1, Email: payload.Email } };
    },
  });

  const req = {
    body: {
      Email: "khachhang@example.com",
      MatKhau: "Password123!",
    },
  };
  const res = createMockRes();

  await authController.register(req, res);

  assert.deepEqual(receivedPayload, req.body);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.customer.MaKH, 1);
});

test("auth controller changePassword lấy MaKH từ req.user", async () => {
  const createAuthController = await loadCreateAuthController();
  let receivedUserId = null;
  let receivedPayload = null;
  const authController = createAuthController({
    changePassword: async (userId, payload) => {
      receivedUserId = userId;
      receivedPayload = payload;
      return { message: "Đổi mật khẩu thành công." };
    },
  });

  const req = {
    user: { MaKH: 99 },
    body: {
      MatKhauHienTai: "Password123!",
      MatKhauMoi: "Password456!",
    },
  };
  const res = createMockRes();

  await authController.changePassword(req, res);

  assert.equal(receivedUserId, 99);
  assert.deepEqual(receivedPayload, req.body);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
});
