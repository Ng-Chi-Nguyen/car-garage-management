import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";

const loadAuthMiddleware = async () => {
  const module = await import("../src/middleware/auth/auth.middleware.js");
  return module.default;
};

const createMockRes = () => {
  const res = {
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
  };

  return res;
};

test("requireAuth trả 401 khi thiếu bearer token", async () => {
  process.env.AUTH_BYPASS = "false";
  process.env.NODE_ENV = "test";

  const authMiddleware = await loadAuthMiddleware();
  const req = { headers: {} };
  const res = createMockRes();
  let nextCalled = false;

  authMiddleware.requireAuth(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.success, false);
});

test("requireAuth gắn thông tin user khi token hợp lệ", async () => {
  process.env.AUTH_BYPASS = "false";
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test-secret";

  const authMiddleware = await loadAuthMiddleware();
  const token = jwt.sign({ MaKH: 1, ChucVu: "KhachHang" }, process.env.JWT_SECRET);
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = createMockRes();
  let nextCalled = false;

  authMiddleware.requireAuth(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(req.user.MaKH, 1);
  assert.equal(req.user.ChucVu, "KhachHang");
});

test("requireRoles trả 403 khi vai trò không được phép", async () => {
  process.env.AUTH_BYPASS = "false";
  process.env.NODE_ENV = "test";

  const authMiddleware = await loadAuthMiddleware();
  const req = { user: { MaKH: 1, ChucVu: "KhachHang" } };
  const res = createMockRes();
  let nextCalled = false;

  authMiddleware.requireRoles(["Admin", "NhanVien"])(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 403);
  assert.equal(res.body.success, false);
});
