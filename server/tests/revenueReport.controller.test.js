import test from "node:test";
import assert from "node:assert/strict";

const ensureTestDatabaseUrl = () => {
  process.env.DATABASE_URL ??= "mysql://tester:secret@127.0.0.1:3306/garage_test";
};

const loadCreateRevenueReportController = async () => {
  ensureTestDatabaseUrl();
  const module = await import("../src/controllers/report/revenueReport.controller.js");
  return module.createRevenueReportController;
};

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

test("controller goi getRevenueTimeseries va tra response contract", async () => {
  const createRevenueReportController = await loadCreateRevenueReportController();
  let receivedQuery;
  const validatedQuery = {
    granularity: "day",
    from: "2026-03-01",
    to: "2026-03-31",
  };
  const controller = createRevenueReportController({
    getRevenueTimeseries: async (query) => {
      receivedQuery = query;
      return {
        range: validatedQuery,
        items: [{ label: "2026-03-01", revenue: 1000000 }],
        totalRevenue: 1000000,
      };
    },
  });

  const res = createMockRes();
  await controller.getRevenueTimeseries({ validatedQuery }, res);

  assert.equal(receivedQuery, validatedQuery);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {
    success: true,
    message: "Lấy báo cáo doanh thu theo thời gian thành công.",
    data: {
      range: validatedQuery,
      items: [{ label: "2026-03-01", revenue: 1000000 }],
      totalRevenue: 1000000,
    },
  });
});

test("controller giu nguyen status va message voi loi 4xx tu service", async () => {
  const createRevenueReportController = await loadCreateRevenueReportController();
  const controller = createRevenueReportController({
    getRevenueComparison: async () => {
      const error = new Error("Khoảng thời gian không hợp lệ.");
      error.status = 400;
      throw error;
    },
  });

  const res = createMockRes();
  await controller.getRevenueComparison({ validatedQuery: {} }, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, {
    success: false,
    message: "Khoảng thời gian không hợp lệ.",
  });
});
