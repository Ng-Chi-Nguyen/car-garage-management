import test from "node:test";
import assert from "node:assert/strict";

import { loadCreateFinanceReportController } from "./helpers/financeReport.test-helpers.js";

const createMockRes = () => ({
  statusCode: 200,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(payload) {
    this.body = payload;
    return this;
  },
});

test("finance report controller summary tra success contract", async () => {
  const createFinanceReportController = await loadCreateFinanceReportController();
  let receivedQuery;
  const validatedQuery = {
    granularity: "month",
    from: "2026-01-01",
    to: "2026-03-31",
  };
  const summaryData = {
    totalOutstandingDebt: 12500000,
    collectedAmountTimeseries: {
      granularity: "month",
      items: [{ label: "2026-03", collectedAmount: 2500000 }],
      totalCollectedAmount: 2500000,
    },
    newDebtInCurrentMonth: 3200000,
  };

  const controller = createFinanceReportController({
    getFinanceSummary: async (query) => {
      receivedQuery = query;
      return summaryData;
    },
    getFinanceDebtors: async () => ({ items: [], pagination: {} }),
  });

  const res = createMockRes();
  await controller.getFinanceSummary({ validatedQuery }, res);

  assert.equal(receivedQuery, validatedQuery);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {
    success: true,
    message: "Lấy báo cáo công nợ/tài chính thành công.",
    data: {
      ...summaryData,
      range: validatedQuery,
    },
  });
});

test("finance report controller debtors tra success contract", async () => {
  const createFinanceReportController = await loadCreateFinanceReportController();
  let receivedQuery;
  const validatedQuery = {
    page: 1,
    limit: 10,
    search: "Nguyen",
    groupBy: "vehicle",
  };
  const debtorsData = {
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
  };

  const controller = createFinanceReportController({
    getFinanceSummary: async () => ({}),
    getFinanceDebtors: async (query) => {
      receivedQuery = query;
      return debtorsData;
    },
  });

  const res = createMockRes();
  await controller.getFinanceDebtors({ validatedQuery }, res);

  assert.equal(receivedQuery, validatedQuery);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {
    success: true,
    message: "Lấy danh sách công nợ thành công.",
    data: debtorsData,
  });
});

test("finance report controller propagate loi 4xx tu service", async () => {
  const createFinanceReportController = await loadCreateFinanceReportController();
  const controller = createFinanceReportController({
    getFinanceSummary: async () => {
      const error = new Error("GroupBy không hợp lệ.");
      error.status = 422;
      throw error;
    },
    getFinanceDebtors: async () => ({ items: [], pagination: {} }),
  });

  const res = createMockRes();
  await controller.getFinanceSummary({ validatedQuery: {} }, res);

  assert.equal(res.statusCode, 422);
  assert.deepEqual(res.body, {
    success: false,
    message: "GroupBy không hợp lệ.",
  });
});

test("finance report controller tra message generic voi loi 5xx", async () => {
  const createFinanceReportController = await loadCreateFinanceReportController();
  const controller = createFinanceReportController({
    getFinanceSummary: async () => ({
      totalOutstandingDebt: 0,
      collectedAmountTimeseries: { granularity: "day", items: [], totalCollectedAmount: 0 },
      newDebtInCurrentMonth: 0,
    }),
    getFinanceDebtors: async () => {
      const error = new Error("Database exploded");
      error.status = 500;
      throw error;
    },
  });

  const res = createMockRes();
  await controller.getFinanceDebtors({ validatedQuery: {} }, res);

  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, {
    success: false,
    message: "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.",
  });
});
