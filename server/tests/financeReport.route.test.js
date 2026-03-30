import test from "node:test";
import assert from "node:assert/strict";

import {
  loadCreateFinanceReportController,
  loadCreateFinanceReportRoute,
  startTestServer,
  stopTestServer,
} from "./helpers/financeReport.test-helpers.js";

test("route GET /summary tra payload dung contract", async () => {
  const createFinanceReportRoute = await loadCreateFinanceReportRoute();
  const router = createFinanceReportRoute({
    controller: {
      getFinanceSummary: async (req, res) => {
        return res.status(200).json({
          success: true,
          message: "Lấy báo cáo công nợ/tài chính thành công.",
          data: {
            range: {
              from: "2026-03-01",
              to: "2026-03-31",
              granularity: "day",
            },
            totalOutstandingDebt: 12500000,
            collectedAmountTimeseries: {
              granularity: "day",
              items: [{ label: "2026-03-01", collectedAmount: 1000000 }],
              totalCollectedAmount: 1000000,
            },
            newDebtInCurrentMonth: 3200000,
          },
        });
      },
      getFinanceDebtors: async (req, res) => res.status(200).json({ success: true, data: {} }),
    },
  });

  const { server, baseUrl } = await startTestServer(router);
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/reports/finance/summary?granularity=day&from=2026-03-01&to=2026-03-31`,
    );
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.success, true);
    assert.equal(payload.message, "Lấy báo cáo công nợ/tài chính thành công.");
    assert.equal(payload.data.range.granularity, "day");
    assert.equal(payload.data.totalOutstandingDebt, 12500000);
    assert.equal(payload.data.newDebtInCurrentMonth, 3200000);
  } finally {
    await stopTestServer(server);
  }
});

test("route GET /debtors tra payload dung contract", async () => {
  const createFinanceReportRoute = await loadCreateFinanceReportRoute();
  const router = createFinanceReportRoute({
    controller: {
      getFinanceSummary: async (req, res) => res.status(200).json({ success: true, data: {} }),
      getFinanceDebtors: async (req, res) => {
        return res.status(200).json({
          success: true,
          message: "Lấy danh sách công nợ thành công.",
          data: {
            items: [
              {
                vehicleId: 1,
                licensePlate: "51A-12345",
                customerId: 10,
                customerName: "Nguyen Van A",
                phoneNumber: "0909",
                outstandingDebt: 4000000,
              },
            ],
            pagination: {
              page: 1,
              limit: 10,
              totalItems: 1,
              totalPages: 1,
            },
          },
        });
      },
    },
  });

  const { server, baseUrl } = await startTestServer(router);
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/reports/finance/debtors?page=1&limit=10&groupBy=vehicle`,
    );
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.success, true);
    assert.equal(payload.message, "Lấy danh sách công nợ thành công.");
    assert.equal(payload.data.items[0].vehicleId, 1);
    assert.equal(payload.data.pagination.totalItems, 1);
  } finally {
    await stopTestServer(server);
  }
});

test("route debtors chay middleware theo thu tu validate controller", async () => {
  const createFinanceReportRoute = await loadCreateFinanceReportRoute();
  const calls = [];
  const router = createFinanceReportRoute({
    schema: {
      getFinanceSummary: {
        query: { validate: (query) => ({ error: undefined, value: query }) },
      },
      getFinanceDebtors: {
        query: {
          validate(query) {
            calls.push("validate");
            return { error: undefined, value: query };
          },
        },
      },
    },
    controller: {
      getFinanceSummary: async (req, res) => res.status(200).json({ success: true, data: {} }),
      getFinanceDebtors: async (req, res) => {
        calls.push("controller");
        return res.status(200).json({ success: true, data: {} });
      },
    },
  });

  const { server, baseUrl } = await startTestServer(router);
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/reports/finance/debtors?page=1&limit=10&groupBy=vehicle`,
    );

    assert.equal(response.status, 200);
    assert.deepEqual(calls, ["validate", "controller"]);
  } finally {
    await stopTestServer(server);
  }
});

test("route debtors tra 400 khi query khong hop le", async () => {
  const createFinanceReportRoute = await loadCreateFinanceReportRoute();
  let controllerCalled = false;
  const router = createFinanceReportRoute({
    controller: {
      getFinanceSummary: async (req, res) => res.status(200).json({ success: true, data: {} }),
      getFinanceDebtors: async (req, res) => {
        controllerCalled = true;
        return res.status(200).json({ success: true, data: {} });
      },
    },
  });

  const { server, baseUrl } = await startTestServer(router);
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/reports/finance/debtors?page=0&limit=10&groupBy=vehicle`,
    );
    const payload = await response.json();

    assert.equal(response.status, 400);
    assert.equal(payload.success, false);
    assert.equal(controllerCalled, false);
  } finally {
    await stopTestServer(server);
  }
});

test("route summary tra 400 khi query khong hop le", async () => {
  const createFinanceReportRoute = await loadCreateFinanceReportRoute();
  let controllerCalled = false;
  const router = createFinanceReportRoute({
    controller: {
      getFinanceSummary: async (req, res) => {
        controllerCalled = true;
        return res.status(200).json({ success: true, data: {} });
      },
      getFinanceDebtors: async (req, res) => res.status(200).json({ success: true, data: {} }),
    },
  });

  const { server, baseUrl } = await startTestServer(router);
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/reports/finance/summary?granularity=week&from=2026-03-01&to=2026-03-31`,
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
  const createFinanceReportRoute = await loadCreateFinanceReportRoute();
  const createFinanceReportController = await loadCreateFinanceReportController();
  let serviceReceivedQuery;

  const controller = createFinanceReportController({
    getFinanceSummary: async () => ({
      totalOutstandingDebt: 0,
      collectedAmountTimeseries: { granularity: "day", items: [], totalCollectedAmount: 0 },
      newDebtInCurrentMonth: 0,
    }),
    getFinanceDebtors: async (query) => {
      serviceReceivedQuery = query;
      return {
        items: [],
        pagination: {
          page: 1,
          limit: 10,
          totalItems: 0,
          totalPages: 0,
        },
      };
    },
  });

  const validatedQuery = {
    page: 1,
    limit: 10,
    search: "Nguyen",
    groupBy: "customer",
  };

  const router = createFinanceReportRoute({
    schema: {
      getFinanceSummary: {
        query: { validate: () => ({ error: undefined, value: {} }) },
      },
      getFinanceDebtors: {
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
      `${baseUrl}/api/v1/reports/finance/debtors?page=1&limit=10&groupBy=customer&search=Nguyen`,
    );
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(serviceReceivedQuery, validatedQuery);
    assert.deepEqual(payload.data.pagination, {
      page: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 0,
    });
  } finally {
    await stopTestServer(server);
  }
});
