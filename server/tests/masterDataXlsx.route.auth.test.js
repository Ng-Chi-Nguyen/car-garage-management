import test from "node:test";
import assert from "node:assert/strict";

import authMiddleware from "../src/middleware/auth/auth.middleware.js";

const TEST_DATABASE_URL = "mysql://tester:secret@127.0.0.1:3306/garage_test";

const loadRouteMounts = async () => {
  process.env.DATABASE_URL ??= TEST_DATABASE_URL;

  const module = await import("../src/routes/index.route.js");
  const Routes = module.default;

  const calls = [];
  const app = {
    use(...args) {
      calls.push(args);
    },
  };

  Routes(app);
  return calls;
};

test("master-data xlsx route duoc mount voi auth va role guard", async () => {
  const calls = await loadRouteMounts();
  const mountByPath = new Map(calls.map((routeCall) => [routeCall[0], routeCall]));
  const masterDataXlsxMount = mountByPath.get("/api/v1/master-data/xlsx");

  assert.ok(masterDataXlsxMount, "master-data xlsx route should be mounted");
  assert.equal(
    masterDataXlsxMount.length,
    4,
    "master-data xlsx route should include path, auth middleware, role guard, and router",
  );
  assert.equal(
    masterDataXlsxMount[1],
    authMiddleware.requireAuth,
    "master-data xlsx route should require authentication",
  );
  assert.equal(
    typeof masterDataXlsxMount[2],
    "function",
    "master-data xlsx route should include role guard middleware",
  );
});
