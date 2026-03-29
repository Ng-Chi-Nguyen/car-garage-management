import test from "node:test";
import assert from "node:assert/strict";
import {
  ensureTestDatabaseUrl,
  loadCreateDashboardRoute,
  startTestServer,
  stopTestServer,
} from "./helpers/dashboard.test-helpers.js";

const loadCreateDashboardController = async () => {
  ensureTestDatabaseUrl();
  const module = await import("../src/controllers/report/dashboard.controller.js");
  return module.createDashboardController;
};

test("route GET /revenue-summary tra payload dung contract", async () => {
  const createDashboardRoute = await loadCreateDashboardRoute();
  const router = createDashboardRoute({
    auth: {
      requireAuth: (req, res, next) => {
        req.user = { ChucVu: "Admin" };
        next();
      },
      requireRoles: () => (req, res, next) => next(),
    },
    controller: {
      getRevenueSummary: async (req, res) => {
        return res.status(200).json({
          success: true,
          message: "Lấy thống kê doanh thu dashboard thành công.",
          data: {
            summary: {
              todayRevenue: 1,
              weekRevenue: 2,
              monthRevenue: 3,
              todayReceivedVehicles: 4,
              activeRepairOrders: 5,
              totalCollectedAmount: 6,
              totalOutstandingDebt: 7,
              lowStockPartsCount: 8,
            },
            alerts: [],
          },
        });
      },
    },
  });

  const { server, baseUrl } = await startTestServer(router);

  try {
    const response = await fetch(`${baseUrl}/api/v1/dashboard/revenue-summary`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(payload, {
      success: true,
      message: "Lấy thống kê doanh thu dashboard thành công.",
      data: {
        summary: {
          todayRevenue: 1,
          weekRevenue: 2,
          monthRevenue: 3,
          todayReceivedVehicles: 4,
          activeRepairOrders: 5,
          totalCollectedAmount: 6,
          totalOutstandingDebt: 7,
          lowStockPartsCount: 8,
        },
        alerts: [],
      },
    });
  } finally {
    await stopTestServer(server);
  }
});

test("route chay middleware theo thu tu auth roles validate controller", async () => {
  const createDashboardRoute = await loadCreateDashboardRoute();
  const calls = [];
  const router = createDashboardRoute({
    auth: {
      requireAuth: (req, res, next) => {
        calls.push("auth");
        req.user = { ChucVu: "Admin" };
        next();
      },
      requireRoles: (roles) => (req, res, next) => {
        calls.push(`roles:${roles.join(",")}`);
        next();
      },
    },
    schema: {
      getRevenueSummary: {
        query: {
          validate(query) {
            calls.push("validate");
            return {
              error: undefined,
              value: query,
            };
          },
        },
      },
    },
    controller: {
      getRevenueSummary: async (req, res) => {
        calls.push("controller");
        return res.status(200).json({
          success: true,
          data: {
            summary: {},
          },
        });
      },
    },
  });

  const { server, baseUrl } = await startTestServer(router);

  try {
    const response = await fetch(`${baseUrl}/api/v1/dashboard/revenue-summary`);

    assert.equal(response.status, 200);
    assert.deepEqual(calls, [
      "auth",
      "roles:Admin,NhanVien",
      "validate",
      "controller",
    ]);
  } finally {
    await stopTestServer(server);
  }
});

test("route tra 400 va khong goi controller khi query la", async () => {
  const createDashboardRoute = await loadCreateDashboardRoute();
  let controllerCalled = false;
  const router = createDashboardRoute({
    auth: {
      requireAuth: (req, res, next) => {
        req.user = { ChucVu: "Admin" };
        next();
      },
      requireRoles: () => (req, res, next) => next(),
    },
    controller: {
      getRevenueSummary: async (req, res) => {
        controllerCalled = true;
        return res.status(200).json({
          success: true,
          data: {
            summary: {},
          },
        });
      },
    },
  });

  const { server, baseUrl } = await startTestServer(router);

  try {
    const response = await fetch(
      `${baseUrl}/api/v1/dashboard/revenue-summary?from=2026-03-01`,
    );
    const payload = await response.json();

    assert.equal(response.status, 400);
    assert.equal(payload.success, false);
    assert.equal(controllerCalled, false);
  } finally {
    await stopTestServer(server);
  }
});

test("route-controller integration truyen req.validatedQuery den service", async () => {
  const createDashboardRoute = await loadCreateDashboardRoute();
  const createDashboardController = await loadCreateDashboardController();
  let serviceReceivedQuery;

  const controller = createDashboardController({
    getRevenueSummary: async (query) => {
      serviceReceivedQuery = query;

        return {
          summary: {
            todayRevenue: 10,
            weekRevenue: 20,
            monthRevenue: 30,
            todayReceivedVehicles: 40,
            activeRepairOrders: 50,
            totalCollectedAmount: 60,
            totalOutstandingDebt: 70,
            lowStockPartsCount: 80,
          },
          alerts: [],
        };
      },
  });

  const validatedQuery = {
    scope: "normalized",
  };

  const router = createDashboardRoute({
    auth: {
      requireAuth: (req, res, next) => {
        req.user = { ChucVu: "Admin" };
        next();
      },
      requireRoles: () => (req, res, next) => next(),
    },
    schema: {
      getRevenueSummary: {
        query: {
          validate() {
            return {
              error: undefined,
              value: validatedQuery,
            };
          },
        },
      },
    },
    controller,
  });

  const { server, baseUrl } = await startTestServer(router);

  try {
    const response = await fetch(
      `${baseUrl}/api/v1/dashboard/revenue-summary?from=2026-03-01`,
    );

    assert.equal(response.status, 200);
    assert.equal(serviceReceivedQuery, validatedQuery);
  } finally {
    await stopTestServer(server);
  }
});
