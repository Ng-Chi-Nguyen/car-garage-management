import test from "node:test";
import assert from "node:assert/strict";
import {
  loadCreateCustomerReportController,
  loadCreateCustomerReportRoute,
  startTestServer,
  stopTestServer,
} from "./helpers/customerReport.test-helpers.js";

test("route GET /summary tra payload dung contract", async () => {
  const createCustomerReportRoute = await loadCreateCustomerReportRoute();
  const router = createCustomerReportRoute({
    controller: {
      getCustomerSummary: async (req, res) => {
        return res.status(200).json({
          success: true,
          message: "Lấy báo cáo thống kê khách hàng thành công.",
          data: {
            range: {
              from: "2026-03-01",
              to: "2026-03-31",
              granularity: "day",
            },
            newCustomersTimeseries: {
              items: [{ label: "2026-03-01", newCustomers: 1 }],
              totalNewCustomers: 1,
            },
            topRevenueCustomer: {
              customerId: 7,
              customerName: "Nguyen Van A",
              totalRevenue: 3500000,
            },
            topDebtCustomer: {
              customerId: 8,
              customerName: "Le Thi B",
              totalDebt: 1500000,
            },
          },
        });
      },
    },
  });

  const { server, baseUrl } = await startTestServer(router);
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/reports/customer-report/summary?granularity=day&from=2026-03-01&to=2026-03-31`,
    );
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.success, true);
    assert.equal(payload.message, "Lấy báo cáo thống kê khách hàng thành công.");
    assert.equal(payload.data.range.granularity, "day");
    assert.equal(payload.data.newCustomersTimeseries.totalNewCustomers, 1);
    assert.equal(payload.data.topRevenueCustomer.customerId, 7);
    assert.equal(payload.data.topDebtCustomer.customerId, 8);
  } finally {
    await stopTestServer(server);
  }
});

test("route summary chay middleware theo thu tu validate controller", async () => {
  const createCustomerReportRoute = await loadCreateCustomerReportRoute();
  const calls = [];
  const router = createCustomerReportRoute({
    schema: {
      getCustomerSummary: {
        query: {
          validate(query) {
            calls.push("validate");
            return { error: undefined, value: query };
          },
        },
      },
    },
    controller: {
      getCustomerSummary: async (req, res) => {
        calls.push("controller");
        return res.status(200).json({ success: true, data: {} });
      },
    },
  });

  const { server, baseUrl } = await startTestServer(router);
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/reports/customer-report/summary?granularity=day&from=2026-03-01&to=2026-03-31`,
    );

    assert.equal(response.status, 200);
    assert.deepEqual(calls, ["validate", "controller"]);
  } finally {
    await stopTestServer(server);
  }
});

test("route summary tra 400 khi query khong hop le", async () => {
  const createCustomerReportRoute = await loadCreateCustomerReportRoute();
  let controllerCalled = false;
  const router = createCustomerReportRoute({
    controller: {
      getCustomerSummary: async (req, res) => {
        controllerCalled = true;
        return res.status(200).json({ success: true, data: {} });
      },
    },
  });

  const { server, baseUrl } = await startTestServer(router);
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/reports/customer-report/summary?granularity=week&from=2026-03-01&to=2026-03-31`,
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
  const createCustomerReportRoute = await loadCreateCustomerReportRoute();
  const createCustomerReportController = await loadCreateCustomerReportController();
  let serviceReceivedQuery;

  const controller = createCustomerReportController({
    getCustomerSummary: async (query) => {
      serviceReceivedQuery = query;
      return {
        newCustomersTimeseries: {
          items: [],
          totalNewCustomers: 0,
        },
        topRevenueCustomer: null,
        topDebtCustomer: null,
      };
    },
  });

  const validatedQuery = {
    granularity: "month",
    from: "2026-01-01",
    to: "2026-03-31",
  };

  const router = createCustomerReportRoute({
    schema: {
      getCustomerSummary: {
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
      `${baseUrl}/api/v1/reports/customer-report/summary?granularity=month&from=2026-01-01&to=2026-03-31`,
    );
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(serviceReceivedQuery, validatedQuery);
    assert.deepEqual(payload.data.range, validatedQuery);
  } finally {
    await stopTestServer(server);
  }
});
