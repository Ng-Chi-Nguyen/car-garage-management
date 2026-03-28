import test from "node:test";
import assert from "node:assert/strict";
import {
  ensureTestDatabaseUrl,
  loadCreateRevenueReportRoute,
  startTestServer,
  stopTestServer,
} from "./helpers/revenueReport.test-helpers.js";

const loadCreateRevenueReportController = async () => {
  ensureTestDatabaseUrl();
  const module = await import("../src/controllers/report/revenueReport.controller.js");
  return module.createRevenueReportController;
};

test("route GET /timeseries tra payload dung contract", async () => {
  const createRevenueReportRoute = await loadCreateRevenueReportRoute();
  const router = createRevenueReportRoute({
    auth: {
      requireAuth: (req, res, next) => {
        req.user = { ChucVu: "Admin" };
        next();
      },
      requireRoles: () => (req, res, next) => next(),
    },
    controller: {
      getRevenueTimeseries: async (req, res) => res.status(200).json({
        success: true,
        message: "Lấy báo cáo doanh thu theo thời gian thành công.",
        data: {
          range: {
            from: "2026-03-01",
            to: "2026-03-31",
            granularity: "day",
          },
          items: [{ label: "2026-03-01", revenue: 1000000 }],
          totalRevenue: 1000000,
        },
      }),
    },
  });

  const { server, baseUrl } = await startTestServer(router);
  try {
    const response = await fetch(`${baseUrl}/api/v1/reports/revenue/timeseries?granularity=day&from=2026-03-01&to=2026-03-31`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.data.totalRevenue, 1000000);
    assert.equal(payload.data.range.granularity, "day");
  } finally {
    await stopTestServer(server);
  }
});

test("route timeseries chay middleware theo thu tu auth roles validate controller", async () => {
  const createRevenueReportRoute = await loadCreateRevenueReportRoute();
  const calls = [];
  const router = createRevenueReportRoute({
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
      getRevenueTimeseries: {
        query: {
          validate(query) {
            calls.push("validate");
            return { error: undefined, value: query };
          },
        },
      },
    },
    controller: {
      getRevenueTimeseries: async (req, res) => {
        calls.push("controller");
        return res.status(200).json({ success: true, data: {} });
      },
    },
  });

  const { server, baseUrl } = await startTestServer(router);
  try {
    const response = await fetch(`${baseUrl}/api/v1/reports/revenue/timeseries?granularity=day&from=2026-03-01&to=2026-03-31`);

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

test("route timeseries tra 400 khi query khong hop le", async () => {
  const createRevenueReportRoute = await loadCreateRevenueReportRoute();
  let controllerCalled = false;
  const router = createRevenueReportRoute({
    auth: {
      requireAuth: (req, res, next) => {
        req.user = { ChucVu: "Admin" };
        next();
      },
      requireRoles: () => (req, res, next) => next(),
    },
    controller: {
      getRevenueTimeseries: async (req, res) => {
        controllerCalled = true;
        return res.status(200).json({ success: true, data: {} });
      },
    },
  });

  const { server, baseUrl } = await startTestServer(router);
  try {
    const response = await fetch(`${baseUrl}/api/v1/reports/revenue/timeseries?granularity=week&from=2026-03-01&to=2026-03-31`);
    const payload = await response.json();

    assert.equal(response.status, 400);
    assert.equal(payload.success, false);
    assert.equal(controllerCalled, false);
  } finally {
    await stopTestServer(server);
  }
});

test("route timeseries tra 400 khi from/to khong phai ngay hop le trong lich", async () => {
  const createRevenueReportRoute = await loadCreateRevenueReportRoute();
  let controllerCalled = false;
  const router = createRevenueReportRoute({
    auth: {
      requireAuth: (req, res, next) => {
        req.user = { ChucVu: "Admin" };
        next();
      },
      requireRoles: () => (req, res, next) => next(),
    },
    controller: {
      getRevenueTimeseries: async (req, res) => {
        controllerCalled = true;
        return res.status(200).json({ success: true, data: {} });
      },
    },
  });

  const { server, baseUrl } = await startTestServer(router);
  try {
    const response = await fetch(`${baseUrl}/api/v1/reports/revenue/timeseries?granularity=day&from=2026-02-31&to=2026-03-31`);
    const payload = await response.json();

    assert.equal(response.status, 400);
    assert.equal(payload.success, false);
    assert.equal(controllerCalled, false);
  } finally {
    await stopTestServer(server);
  }
});

test("route-controller integration truyen req.validatedQuery den service", async () => {
  const createRevenueReportRoute = await loadCreateRevenueReportRoute();
  const createRevenueReportController = await loadCreateRevenueReportController();
  let serviceReceivedQuery;

  const controller = createRevenueReportController({
    getRevenueTimeseries: async (query) => {
      serviceReceivedQuery = query;
      return {
        range: query,
        items: [],
        totalRevenue: 0,
      };
    },
  });

  const validatedQuery = {
    granularity: "month",
    from: "2026-01-01",
    to: "2026-03-31",
  };

  const router = createRevenueReportRoute({
    auth: {
      requireAuth: (req, res, next) => {
        req.user = { ChucVu: "Admin" };
        next();
      },
      requireRoles: () => (req, res, next) => next(),
    },
    schema: {
      getRevenueTimeseries: {
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
    const response = await fetch(`${baseUrl}/api/v1/reports/revenue/timeseries?granularity=month&from=2026-01-01&to=2026-03-31`);

    assert.equal(response.status, 200);
    assert.equal(serviceReceivedQuery, validatedQuery);
  } finally {
    await stopTestServer(server);
  }
});
