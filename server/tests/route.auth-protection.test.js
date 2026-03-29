import test from "node:test";
import assert from "node:assert/strict";

import authMiddleware from "../src/middleware/auth/auth.middleware.js";

const ensureTestDatabaseUrl = () => {
  process.env.DATABASE_URL ??= "mysql://tester:secret@127.0.0.1:3306/garage_test";
};

const loadRoutes = async () => {
  ensureTestDatabaseUrl();
  const module = await import("../src/routes/index.route.js");
  return module.default;
};

const loadRouteModules = async () => {
  ensureTestDatabaseUrl();

  const [
    authRouteModule,
    dashboardRouteModule,
    repairOrderWorkflowRouteModule,
    stockReceiptWorkflowRouteModule,
    paymentReceiptWorkflowRouteModule,
    customerRouteModule,
    carBrandRouteModule,
    vehicleRouteModule,
    repairOrderRouteModule,
    laborFeeRouteModule,
    partRouteModule,
    repairOrderDetailRouteModule,
    supplierRouteModule,
    stockReceiptRouteModule,
    stockReceiptDetailRouteModule,
    paymentReceiptRouteModule,
  ] = await Promise.all([
    import("../src/routes/auth/auth.route.js"),
    import("../src/routes/report/dashboard.route.js"),
    import("../src/routes/workflows/repairOrderWorkflow.route.js"),
    import("../src/routes/workflows/stockReceiptWorkflow.route.js"),
    import("../src/routes/workflows/paymentReceiptWorkflow.route.js"),
    import("../src/routes/management/customer.route.js"),
    import("../src/routes/management/carBrand.route.js"),
    import("../src/routes/management/vehicle.route.js"),
    import("../src/routes/management/repairOrder.route.js"),
    import("../src/routes/management/laborFee.route.js"),
    import("../src/routes/management/part.route.js"),
    import("../src/routes/management/repairOrderDetail.route.js"),
    import("../src/routes/management/supplier.route.js"),
    import("../src/routes/management/stockReceipt.route.js"),
    import("../src/routes/management/stockReceiptDetail.route.js"),
    import("../src/routes/management/paymentReceipt.route.js"),
  ]);

  return {
    authRoute: authRouteModule.default,
    dashboardRoute: dashboardRouteModule.default,
    repairOrderWorkflowRoute: repairOrderWorkflowRouteModule.default,
    stockReceiptWorkflowRoute: stockReceiptWorkflowRouteModule.default,
    paymentReceiptWorkflowRoute: paymentReceiptWorkflowRouteModule.default,
    customerRoute: customerRouteModule.default,
    carBrandRoute: carBrandRouteModule.default,
    vehicleRoute: vehicleRouteModule.default,
    repairOrderRoute: repairOrderRouteModule.default,
    laborFeeRoute: laborFeeRouteModule.default,
    partRoute: partRouteModule.default,
    repairOrderDetailRoute: repairOrderDetailRouteModule.default,
    supplierRoute: supplierRouteModule.default,
    stockReceiptRoute: stockReceiptRouteModule.default,
    stockReceiptDetailRoute: stockReceiptDetailRouteModule.default,
    paymentReceiptRoute: paymentReceiptRouteModule.default,
  };
};

const createExpectedProtectedEntries = (routes) => [
  { path: "/api/v1/dashboard", route: routes.dashboardRoute },
  { path: "/api/v1/workflows/repair-orders", route: routes.repairOrderWorkflowRoute },
  { path: "/api/v1/workflows/stock-receipts", route: routes.stockReceiptWorkflowRoute },
  { path: "/api/v1/workflows/payment-receipts", route: routes.paymentReceiptWorkflowRoute },
  { path: "/api/v1/customers", route: routes.customerRoute },
  { path: "/api/v1/car-brands", route: routes.carBrandRoute },
  { path: "/api/v1/vehicles", route: routes.vehicleRoute },
  { path: "/api/v1/repair-orders", route: routes.repairOrderRoute },
  { path: "/api/v1/labor-fees", route: routes.laborFeeRoute },
  { path: "/api/v1/parts", route: routes.partRoute },
  { path: "/api/v1/repair-order-details", route: routes.repairOrderDetailRoute },
  { path: "/api/v1/suppliers", route: routes.supplierRoute },
  { path: "/api/v1/stock-receipts", route: routes.stockReceiptRoute },
  { path: "/api/v1/stock-receipt-details", route: routes.stockReceiptDetailRoute },
  { path: "/api/v1/payment-receipts", route: routes.paymentReceiptRoute },
];

const createMockResponse = () => ({
  statusCode: null,
  payload: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.payload = body;
    return this;
  },
});

const assertRoleGuardBehavior = (roleGuard, path) => {
  {
    const req = {};
    const res = createMockResponse();
    let nextCalled = false;

    roleGuard(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false, `${path} role guard should not call next without req.user`);
    assert.equal(res.statusCode, 401, `${path} role guard should return 401 without req.user`);
  }

  {
    const req = { user: { ChucVu: "KhachHang" } };
    const res = createMockResponse();
    let nextCalled = false;

    roleGuard(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false, `${path} role guard should not call next for KhachHang`);
    assert.equal(res.statusCode, 403, `${path} role guard should return 403 for KhachHang`);
  }

  {
    const req = { user: { ChucVu: "Admin" } };
    const res = createMockResponse();
    let nextCalled = false;

    roleGuard(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true, `${path} role guard should call next for Admin`);
    assert.equal(res.statusCode, null, `${path} role guard should not set status for Admin`);
  }

  {
    const req = { user: { ChucVu: "NhanVien" } };
    const res = createMockResponse();
    let nextCalled = false;

    roleGuard(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true, `${path} role guard should call next for NhanVien`);
    assert.equal(res.statusCode, null, `${path} role guard should not set status for NhanVien`);
  }
};

const assertProtectedMount = (routeCall, path, expectedRoute) => {
  assert.ok(routeCall.length >= 4, `${path} should include auth middlewares and router`);
  assert.equal(routeCall[1], authMiddleware.requireAuth, `${path} should use requireAuth as first middleware`);
  assert.equal(typeof routeCall[2], "function", `${path} should include role guard middleware`);
  assert.equal(routeCall.at(-1), expectedRoute, `${path} should mount the expected router at last position`);
  assertRoleGuardBehavior(routeCall[2], path);
};

test("Routes mount auth route và bảo vệ management/workflow routes bằng auth middleware", async () => {
  const Routes = await loadRoutes();
  const routeModules = await loadRouteModules();
  const expectedProtectedEntries = createExpectedProtectedEntries(routeModules);

  const calls = [];
  const app = {
    use(...args) {
      calls.push(args);
    },
  };

  Routes(app);

  assert.ok(calls.length > 0, "should mount at least one route");

  for (const routeCall of calls) {
    assert.equal(typeof routeCall[0], "string", "all mounts should provide explicit string path");
    assert.ok(routeCall[0].startsWith("/api/v1/"), `${routeCall[0]} should start with /api/v1/`);
  }

  const mountByPath = new Map(calls.map((routeCall) => [routeCall[0], routeCall]));
  const publicMounts = calls.filter(([path]) => path === "/api/v1/auth");

  assert.equal(publicMounts.length, 1, "auth route should be mounted once");
  assert.equal(publicMounts[0].length, 2, "auth route should not be wrapped by management role middleware");
  assert.equal(publicMounts[0].at(-1), routeModules.authRoute, "auth route should mount auth router directly");

  for (const { path, route } of expectedProtectedEntries) {
    const routeCall = mountByPath.get(path);
    assert.ok(routeCall, `${path} should be mounted`);
    assertProtectedMount(routeCall, path, route);
  }

  const protectedMounts = calls.filter(([path]) => path !== "/api/v1/auth");
  assert.equal(protectedMounts.length, expectedProtectedEntries.length, "only /api/v1/auth should be public");
});
