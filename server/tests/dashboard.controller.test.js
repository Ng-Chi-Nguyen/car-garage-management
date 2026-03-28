import test from "node:test";
import assert from "node:assert/strict";

const ensureTestDatabaseUrl = () => {
  process.env.DATABASE_URL ??= "mysql://tester:secret@127.0.0.1:3306/garage_test";
};

const loadCreateDashboardController = async () => {
  ensureTestDatabaseUrl();
  const module = await import("../src/controllers/report/dashboard.controller.js");
  return module.createDashboardController;
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

test("controller goi getRevenueSummary va tra response contract", async () => {
  const createDashboardController = await loadCreateDashboardController();
  let receivedQuery;
  const validatedQuery = {};
  const controller = createDashboardController({
    getRevenueSummary: async (query) => {
      receivedQuery = query;
      return {
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
      };
    },
  });

  const res = createMockRes();

  await controller.getRevenueSummary(
    {
      validatedQuery,
      query: { from: "2026-03-01" },
    },
    res,
  );

  assert.equal(res.statusCode, 200);
  assert.equal(receivedQuery, validatedQuery);
  assert.deepEqual(res.body, {
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
});

test("controller khong tu validate validatedQuery va uy quyen xu ly cho service", async () => {
  const createDashboardController = await loadCreateDashboardController();
  let serviceCalled = false;
  let receivedQuery;

  const controller = createDashboardController({
    getRevenueSummary: async (query) => {
      serviceCalled = true;
      receivedQuery = query;

      return {
        summary: {
          todayRevenue: 0,
          weekRevenue: 0,
          monthRevenue: 0,
          todayReceivedVehicles: 0,
          activeRepairOrders: 0,
          totalCollectedAmount: 0,
          totalOutstandingDebt: 0,
          lowStockPartsCount: 0,
        },
        alerts: [],
      };
    },
  });

  const res = createMockRes();

  await controller.getRevenueSummary(
    {
      query: { from: "2026-03-01" },
    },
    res,
  );

  assert.equal(serviceCalled, true);
  assert.equal(receivedQuery, undefined);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {
    success: true,
    message: "Lấy thống kê doanh thu dashboard thành công.",
    data: {
      summary: {
        todayRevenue: 0,
        weekRevenue: 0,
        monthRevenue: 0,
        todayReceivedVehicles: 0,
        activeRepairOrders: 0,
        totalCollectedAmount: 0,
        totalOutstandingDebt: 0,
        lowStockPartsCount: 0,
      },
      alerts: [],
    },
  });
});

test("controller tra message generic cho loi 500", async () => {
  const createDashboardController = await loadCreateDashboardController();
  const controller = createDashboardController({
    getRevenueSummary: async () => {
      throw new Error("boom");
    },
  });

  const res = createMockRes();

  await controller.getRevenueSummary({ validatedQuery: {} }, res);

  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, {
    success: false,
    message: "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.",
  });
});

test("controller giu nguyen status va message voi loi 4xx tu service", async () => {
  const createDashboardController = await loadCreateDashboardController();
  const controller = createDashboardController({
    getRevenueSummary: async () => {
      const error = new Error("Không có quyền xem thống kê.");
      error.status = 403;
      throw error;
    },
  });

  const res = createMockRes();

  await controller.getRevenueSummary({ validatedQuery: {} }, res);

  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.body, {
    success: false,
    message: "Không có quyền xem thống kê.",
  });
});
