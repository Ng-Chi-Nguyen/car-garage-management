import test from "node:test";
import assert from "node:assert/strict";

import {
  ensureTestDatabaseUrl,
  loadCreateInventoryReportController,
  loadCreateInventoryReportRoute,
  startTestServer,
  stopTestServer,
} from "./helpers/inventoryReport.test-helpers.js";

const loadRoutes = async () => {
  ensureTestDatabaseUrl();
  const module = await import("../src/routes/index.route.js");
  return module.default;
};

test("route GET /summary tra payload dung contract", async () => {
  const createInventoryReportRoute = await loadCreateInventoryReportRoute();
  const router = createInventoryReportRoute({
    controller: {
      getInventorySummary: async (req, res) => {
        return res.status(200).json({
          success: true,
          message: "Lay bao cao thong ke kho phu tung thanh cong.",
          data: {
            range: {
              from: "2026-03-01",
              to: "2026-03-31",
            },
            stockMovement: {
              totals: {
                openingQuantity: 10,
                importedQuantity: 5,
                exportedQuantity: 3,
                closingQuantity: 12,
              },
              items: [],
            },
            mostUsedParts: [],
            lowStockParts: [],
            currentInventoryValue: {
              totalValue: 100000,
              totalQuantity: 12,
              partCount: 1,
            },
            topSupplier: null,
          },
        });
      },
    },
  });

  const { server, baseUrl } = await startTestServer(router);
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/reports/inventory/summary?from=2026-03-01&to=2026-03-31`,
    );
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.success, true);
    assert.equal(payload.data.stockMovement.totals.closingQuantity, 12);
    assert.equal(payload.data.currentInventoryValue.totalValue, 100000);
  } finally {
    await stopTestServer(server);
  }
});

test("route summary chay middleware theo thu tu validate controller", async () => {
  const createInventoryReportRoute = await loadCreateInventoryReportRoute();
  const calls = [];
  const router = createInventoryReportRoute({
    schema: {
      getInventorySummary: {
        query: {
          validate(query) {
            calls.push("validate");
            return { error: undefined, value: query };
          },
        },
      },
    },
    controller: {
      getInventorySummary: async (req, res) => {
        calls.push("controller");
        return res.status(200).json({ success: true, data: {} });
      },
    },
  });

  const { server, baseUrl } = await startTestServer(router);
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/reports/inventory/summary?from=2026-03-01&to=2026-03-31`,
    );

    assert.equal(response.status, 200);
    assert.deepEqual(calls, ["validate", "controller"]);
  } finally {
    await stopTestServer(server);
  }
});

test("route summary tra 400 khi query khong hop le", async () => {
  const createInventoryReportRoute = await loadCreateInventoryReportRoute();
  let controllerCalled = false;
  const router = createInventoryReportRoute({
    controller: {
      getInventorySummary: async (req, res) => {
        controllerCalled = true;
        return res.status(200).json({ success: true, data: {} });
      },
    },
  });

  const { server, baseUrl } = await startTestServer(router);
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/reports/inventory/summary?from=2026-03-40&to=2026-03-31`,
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
  const createInventoryReportRoute = await loadCreateInventoryReportRoute();
  const createInventoryReportController = await loadCreateInventoryReportController();
  let serviceReceivedQuery;

  const controller = createInventoryReportController({
    getInventorySummary: async (query) => {
      serviceReceivedQuery = query;
      return {
        range: query,
        stockMovement: {
          totals: {
            openingQuantity: 0,
            importedQuantity: 0,
            exportedQuantity: 0,
            closingQuantity: 0,
          },
          items: [],
        },
        mostUsedParts: [],
        lowStockParts: [],
        currentInventoryValue: {
          totalValue: 0,
          totalQuantity: 0,
          partCount: 0,
        },
        topSupplier: null,
      };
    },
  });

  const validatedQuery = {
    from: "2026-03-01",
    to: "2026-03-31",
  };

  const router = createInventoryReportRoute({
    schema: {
      getInventorySummary: {
        query: {
          validate() {
            return { error: undefined, value: validatedQuery };
          },
        },
      },
    },
    controller,
  });

  const { server, baseUrl } = await startTestServer(router);
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/reports/inventory/summary?from=2026-03-01&to=2026-03-31`,
    );

    assert.equal(response.status, 200);
    assert.equal(serviceReceivedQuery, validatedQuery);
  } finally {
    await stopTestServer(server);
  }
});

test("index route mount inventory summary tren duong dan that khong bi 404", async () => {
  const Routes = await loadRoutes();
  const express = (await import("express")).default;
  const app = express();
  app.use(express.json());
  Routes(app);

  const { server, baseUrl } = await new Promise((resolve) => {
    const testServer = app.listen(0, () => {
      const { port } = testServer.address();
      resolve({
        server: testServer,
        baseUrl: `http://127.0.0.1:${port}`,
      });
    });
  });

  try {
    const response = await fetch(
      `${baseUrl}/api/v1/reports/inventory/summary?from=2026-03-40&to=2026-03-31`,
    );
    const payload = await response.json();

    assert.notEqual(response.status, 404);
    assert.equal(response.status, 400);
    assert.equal(payload.success, false);
  } finally {
    await stopTestServer(server);
  }
});

test("route inventory export ap dung rate limit", async () => {
  const createInventoryReportRoute = await loadCreateInventoryReportRoute();
  const originalMax = process.env.DASHBOARD_RATE_LIMIT_MAX;
  process.env.DASHBOARD_RATE_LIMIT_MAX = "1";

  const auth = {
    requireAuth(req, res, next) {
      req.user = { ChucVu: "Admin" };
      next();
    },
    requireRoles() {
      return (req, res, next) => next();
    },
  };

  const router = createInventoryReportRoute({
    auth,
    schema: {
      getInventorySummary: {
        query: {
          validate(query) {
            return { error: undefined, value: query };
          },
        },
      },
    },
    controller: {
      getInventorySummary: async (req, res) => res.status(200).json({ success: true, data: {} }),
      exportInventorySummary: async (req, res) => res.status(200).json({ success: true, data: {} }),
    },
  });

  const { server, baseUrl } = await startTestServer(router);

  try {
    const firstResponse = await fetch(`${baseUrl}/api/v1/reports/inventory/summary/export?from=2026-03-01&to=2026-03-31`);
    const secondResponse = await fetch(`${baseUrl}/api/v1/reports/inventory/summary/export?from=2026-03-01&to=2026-03-31`);
    const secondPayload = await secondResponse.json();

    assert.equal(firstResponse.status, 200);
    assert.equal(secondResponse.status, 429);
    assert.equal(secondPayload.success, false);
  } finally {
    process.env.DASHBOARD_RATE_LIMIT_MAX = originalMax;
    await stopTestServer(server);
  }
});
