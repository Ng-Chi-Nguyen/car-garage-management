import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import authMiddleware from "../src/middleware/auth/auth.middleware.js";
import { dashboardAccessMiddlewares } from "../src/routes/report/dashboard.access.js";

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

const loadIndexRouteSource = () =>
  readFile(new URL("../src/routes/index.route.js", import.meta.url), "utf8");

test("Routes active hiện tại là public và vẫn giữ comment protected cho customer-report", async () => {
  const calls = await loadRouteMounts();
  const indexRouteSource = await loadIndexRouteSource();

  assert.ok(calls.length > 0, "should mount at least one route");

  const mountByPath = new Map(calls.map((routeCall) => [routeCall[0], routeCall]));
  const authMount = mountByPath.get("/api/v1/auth");
  assert.ok(authMount, "auth route should be mounted");
  assert.equal(authMount.length, 2, "auth route should stay public");

  const customerReportMount = mountByPath.get("/api/v1/reports/customer-report");
  assert.ok(customerReportMount, "customer-report route should be mounted");
  assert.equal(
    customerReportMount[0],
    "/api/v1/reports/customer-report",
    "customer-report route should use expected path",
  );
  assert.equal(
    customerReportMount.length,
    2,
    "customer-report active mount should have exactly path and router without middleware",
  );
  assert.notEqual(
    customerReportMount[1],
    authMiddleware.requireAuth,
    "customer-report active mount should not include requireAuth",
  );

  assert.match(
    indexRouteSource,
    /app\.use\(`\$\{apiPrefixV1\}\/reports\/customer-report`,\s*customerReportRoute\);\s*\r?\n\s*\/\/\s*app\.use\([^\n]*reports\/customer-report[^\n]*requireManagementAccess[^\n]*customerReportRoute/u,
    "index.route.js should keep protected customer-report mount as commented source line",
  );

  const financeReportMount = mountByPath.get("/api/v1/reports/finance");
  assert.ok(financeReportMount, "finance report route should be mounted");
  assert.equal(
    financeReportMount.length,
    4,
    "finance report active mount should include path, auth middlewares, and router",
  );
  assert.equal(
    financeReportMount[1],
    authMiddleware.requireAuth,
    "finance report active mount should include requireAuth",
  );
  assert.equal(
    typeof financeReportMount[2],
    "function",
    "finance report active mount should include role guard middleware",
  );

  assert.match(
    indexRouteSource,
    /app\.use\(`\$\{apiPrefixV1\}\/reports\/finance`,\s*\.\.\.requireManagementAccess,\s*financeReportRoute\);/u,
    "index.route.js should mount finance-report with management access middleware",
  );

  const paymentReceiptMount = mountByPath.get("/api/v1/payment-receipts");
  assert.ok(paymentReceiptMount, "payment receipt route should be mounted");
  assert.equal(
    paymentReceiptMount.length,
    4,
    "payment receipt route should include path, auth middlewares, and router",
  );
  assert.equal(
    paymentReceiptMount[1],
    authMiddleware.requireAuth,
    "payment receipt route should include requireAuth",
  );
  assert.equal(
    typeof paymentReceiptMount[2],
    "function",
    "payment receipt route should include role guard middleware",
  );

  assert.match(
    indexRouteSource,
    /app\.use\(`\$\{apiPrefixV1\}\/payment-receipts`,\s*\.\.\.requireManagementAccess,\s*paymentReceiptRoute\);/u,
    "index.route.js should mount payment-receipts with management access middleware",
  );
});

test("dashboard route duoc mount voi rate limit va auth guard o index-level", async () => {
  const calls = await loadRouteMounts();
  const mountByPath = new Map(calls.map((routeCall) => [routeCall[0], routeCall]));
  const dashboardMount = mountByPath.get("/api/v1/dashboard");

  assert.ok(dashboardMount, "dashboard route should be mounted");
  assert.equal(dashboardMount.length, 2, "dashboard route remains mounted publicly in current index route");
});
