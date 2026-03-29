import test from "node:test";
import assert from "node:assert/strict";
import { loadCreateCustomerReportController } from "./helpers/customerReport.test-helpers.js";

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

test("customer report controller tra success contract", async () => {
  const createCustomerReportController = await loadCreateCustomerReportController();
  let receivedQuery;
  const validatedQuery = {
    granularity: "month",
    from: "2026-01-01",
    to: "2026-03-31",
  };
  const summaryData = {
    newCustomersTimeseries: {
      items: [{ label: "2026-01", newCustomers: 2 }],
      totalNewCustomers: 2,
    },
    topRevenueCustomer: {
      customerId: 10,
      customerName: "Nguyen Van A",
      totalRevenue: 5000000,
    },
    topDebtCustomer: {
      customerId: 12,
      customerName: "Le Thi B",
      totalDebt: 2000000,
    },
  };
  const controller = createCustomerReportController({
    getCustomerSummary: async (query) => {
      receivedQuery = query;
      return summaryData;
    },
  });

  const res = createMockRes();
  await controller.getCustomerSummary({ validatedQuery }, res);

  assert.equal(receivedQuery, validatedQuery);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {
    success: true,
    message: "Lấy báo cáo thống kê khách hàng thành công.",
    data: {
      ...summaryData,
      range: validatedQuery,
    },
  });
});

test("customer report controller propagate loi 4xx tu service", async () => {
  const createCustomerReportController = await loadCreateCustomerReportController();
  const controller = createCustomerReportController({
    getCustomerSummary: async () => {
      const error = new Error("Khoảng thời gian không hợp lệ.");
      error.status = 422;
      throw error;
    },
  });

  const res = createMockRes();
  await controller.getCustomerSummary({ validatedQuery: {} }, res);

  assert.equal(res.statusCode, 422);
  assert.deepEqual(res.body, {
    success: false,
    message: "Khoảng thời gian không hợp lệ.",
  });
});

test("customer report controller tra message generic voi loi 5xx", async () => {
  const createCustomerReportController = await loadCreateCustomerReportController();
  const controller = createCustomerReportController({
    getCustomerSummary: async () => {
      const error = new Error("Database exploded");
      error.status = 500;
      throw error;
    },
  });

  const res = createMockRes();
  await controller.getCustomerSummary({ validatedQuery: {} }, res);

  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, {
    success: false,
    message: "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.",
  });
});
