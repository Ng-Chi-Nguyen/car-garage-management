import test from "node:test";
import assert from "node:assert/strict";
import express from "express";

const ensureTestDatabaseUrl = () => {
  process.env.DATABASE_URL ??= "mysql://tester:secret@127.0.0.1:3306/garage_test";
};

const loadCreateRevenueReportRoute = async () => {
  ensureTestDatabaseUrl();
  const module = await import("../src/routes/report/revenueReport.route.js");
  return module.createRevenueReportRoute;
};

const startTestServer = async (router) => {
  const app = express();
  app.use(express.json());
  app.use("/api/v1/reports/revenue", router);

  return await new Promise((resolve) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${port}`,
      });
    });
  });
};

const stopTestServer = async (server) =>
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });

test("revenue report route runs auth/roles before validation and controller", async () => {
  const createRevenueReportRoute = await loadCreateRevenueReportRoute();
  const calls = [];

  const auth = {
    requireAuth(req, res, next) {
      calls.push("auth");
      req.user = { ChucVu: "Admin" };
      next();
    },
    requireRoles() {
      return (req, res, next) => {
        calls.push("roles");
        next();
      };
    },
  };

  const schema = {
    getRevenueTimeseries: {
      query: {
        validate(query) {
          calls.push("validate");
          return { error: undefined, value: query };
        },
      },
    },
    getRevenueByCarBrand: { query: { validate: (query) => ({ error: undefined, value: query }) } },
    getRevenueByPart: { query: { validate: (query) => ({ error: undefined, value: query }) } },
    getRevenueComparison: { query: { validate: (query) => ({ error: undefined, value: query }) } },
    getRevenueComposition: { query: { validate: (query) => ({ error: undefined, value: query }) } },
  };

  const controller = {
    getRevenueTimeseries(req, res) {
      calls.push("controller");
      return res.status(200).json({ success: true, data: {} });
    },
    getRevenueByCarBrand: (req, res) => res.status(200).json({ success: true, data: {} }),
    getRevenueByPart: (req, res) => res.status(200).json({ success: true, data: {} }),
    getRevenueComparison: (req, res) => res.status(200).json({ success: true, data: {} }),
    getRevenueComposition: (req, res) => res.status(200).json({ success: true, data: {} }),
  };

  const router = createRevenueReportRoute({ auth, schema, controller });
  const { server, baseUrl } = await startTestServer(router);

  try {
    const response = await fetch(`${baseUrl}/api/v1/reports/revenue/timeseries`);
    assert.equal(response.status, 200);
    assert.deepEqual(calls, ["auth", "roles", "validate", "controller"]);
  } finally {
    await stopTestServer(server);
  }
});

test("revenue report route returns 400 and skips controller when validation fails", async () => {
  const createRevenueReportRoute = await loadCreateRevenueReportRoute();
  let controllerCalled = false;

  const auth = {
    requireAuth(req, res, next) {
      req.user = { ChucVu: "Admin" };
      next();
    },
    requireRoles() {
      return (req, res, next) => next();
    },
  };

  const schema = {
    getRevenueTimeseries: {
      query: {
        validate() {
          return {
            error: {
              details: [{ message: '"granularity" must be one of [day, month]' }],
            },
            value: {},
          };
        },
      },
    },
    getRevenueByCarBrand: { query: { validate: (query) => ({ error: undefined, value: query }) } },
    getRevenueByPart: { query: { validate: (query) => ({ error: undefined, value: query }) } },
    getRevenueComparison: { query: { validate: (query) => ({ error: undefined, value: query }) } },
    getRevenueComposition: { query: { validate: (query) => ({ error: undefined, value: query }) } },
  };

  const controller = {
    getRevenueTimeseries(req, res) {
      controllerCalled = true;
      return res.status(200).json({ success: true, data: {} });
    },
    getRevenueByCarBrand: (req, res) => res.status(200).json({ success: true, data: {} }),
    getRevenueByPart: (req, res) => res.status(200).json({ success: true, data: {} }),
    getRevenueComparison: (req, res) => res.status(200).json({ success: true, data: {} }),
    getRevenueComposition: (req, res) => res.status(200).json({ success: true, data: {} }),
  };

  const router = createRevenueReportRoute({ auth, schema, controller });
  const { server, baseUrl } = await startTestServer(router);

  try {
    const response = await fetch(`${baseUrl}/api/v1/reports/revenue/timeseries?granularity=week`);
    const payload = await response.json();

    assert.equal(response.status, 400);
    assert.equal(payload.success, false);
    assert.equal(controllerCalled, false);
  } finally {
    await stopTestServer(server);
  }
});
