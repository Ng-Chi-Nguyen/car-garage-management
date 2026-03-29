import test from "node:test";
import assert from "node:assert/strict";
import {
  ensureTestDatabaseUrl,
  loadCreateRepairReportRoute,
  startTestServer,
  stopTestServer,
} from "./helpers/repairReport.test-helpers.js";

const loadCreateRepairReportController = async () => {
  ensureTestDatabaseUrl();
  const module = await import("../src/controllers/report/repairReport.controller.js");
  return module.createRepairReportController;
};

test("route GET /summary tra payload dung contract", async () => {
  const createRepairReportRoute = await loadCreateRepairReportRoute();
  const router = createRepairReportRoute({
    controller: {
      getRepairSummary: async (req, res) => {
        return res.status(200).json({
          success: true,
          message: "Lấy báo cáo thống kê sửa chữa thành công.",
          data: {
            range: {
              from: "2026-03-01",
              to: "2026-03-31",
              granularity: "day",
            },
            timeseries: {
              items: [{ label: "2026-03-01", repairOrderCount: 2 }],
              totalRepairOrders: 2,
            },
            statusBreakdown: {
              receiving: 1,
              inProgress: 0,
              completed: 1,
              cancelled: 0,
              total: 2,
            },
            topTechnician: {
              technicianId: 5,
              repairOrderCount: 1,
            },
          },
        });
      },
    },
  });

  const { server, baseUrl } = await startTestServer(router);
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/reports/repair/summary?granularity=day&from=2026-03-01&to=2026-03-31`,
    );
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.success, true);
    assert.equal(payload.message, "Lấy báo cáo thống kê sửa chữa thành công.");
    assert.equal(payload.data.timeseries.totalRepairOrders, 2);
    assert.equal(payload.data.range.granularity, "day");
    assert.equal("averageRepairDuration" in payload.data, false);
  } finally {
    await stopTestServer(server);
  }
});

test("route summary chay middleware theo thu tu validate controller", async () => {
  const createRepairReportRoute = await loadCreateRepairReportRoute();
  const calls = [];
  const router = createRepairReportRoute({
    schema: {
      getRepairSummary: {
        query: {
          validate(query) {
            calls.push("validate");
            return { error: undefined, value: query };
          },
        },
      },
    },
    controller: {
      getRepairSummary: async (req, res) => {
        calls.push("controller");
        return res.status(200).json({ success: true, data: {} });
      },
    },
  });

  const { server, baseUrl } = await startTestServer(router);
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/reports/repair/summary?granularity=day&from=2026-03-01&to=2026-03-31`,
    );

    assert.equal(response.status, 200);
    assert.deepEqual(calls, ["validate", "controller"]);
  } finally {
    await stopTestServer(server);
  }
});

test("route summary tra 400 khi query khong hop le", async () => {
  const createRepairReportRoute = await loadCreateRepairReportRoute();
  let controllerCalled = false;
  const router = createRepairReportRoute({
    controller: {
      getRepairSummary: async (req, res) => {
        controllerCalled = true;
        return res.status(200).json({ success: true, data: {} });
      },
    },
  });

  const { server, baseUrl } = await startTestServer(router);
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/reports/repair/summary?granularity=week&from=2026-03-01&to=2026-03-31`,
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
  const createRepairReportRoute = await loadCreateRepairReportRoute();
  const createRepairReportController = await loadCreateRepairReportController();
  let serviceReceivedQuery;

  const controller = createRepairReportController({
    getRepairSummary: async (query) => {
      serviceReceivedQuery = query;
      return {
        range: query,
        timeseries: {
          items: [],
          totalRepairOrders: 0,
        },
        statusBreakdown: {
          receiving: 0,
          inProgress: 0,
          completed: 0,
          cancelled: 0,
          total: 0,
        },
        topTechnician: null,
      };
    },
  });

  const validatedQuery = {
    granularity: "month",
    from: "2026-01-01",
    to: "2026-03-31",
  };

  const router = createRepairReportRoute({
    schema: {
      getRepairSummary: {
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
      `${baseUrl}/api/v1/reports/repair/summary?granularity=month&from=2026-01-01&to=2026-03-31`,
    );

    assert.equal(response.status, 200);
    assert.equal(serviceReceivedQuery, validatedQuery);
  } finally {
    await stopTestServer(server);
  }
});
