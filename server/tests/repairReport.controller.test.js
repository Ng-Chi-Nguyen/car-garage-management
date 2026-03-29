import test from "node:test";
import assert from "node:assert/strict";

const ensureTestDatabaseUrl = () => {
  process.env.DATABASE_URL ??= "mysql://tester:secret@127.0.0.1:3306/garage_test";
};

const loadCreateRepairReportController = async () => {
  ensureTestDatabaseUrl();
  const module = await import("../src/controllers/report/repairReport.controller.js");
  return module.createRepairReportController;
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

test("repair report controller tra success contract", async () => {
  const createRepairReportController = await loadCreateRepairReportController();
  let receivedQuery;
  const validatedQuery = {
    granularity: "month",
    from: "2026-01-01",
    to: "2026-03-31",
  };
  const controller = createRepairReportController({
    getRepairSummary: async (query) => {
      receivedQuery = query;
      return {
        range: validatedQuery,
        timeseries: {
          items: [{ label: "2026-01", repairOrderCount: 5 }],
          totalRepairOrders: 5,
        },
        statusBreakdown: {
          receiving: 1,
          inProgress: 1,
          completed: 2,
          cancelled: 1,
          total: 5,
        },
        topTechnician: {
          technicianId: 10,
          repairOrderCount: 3,
        },
      };
    },
  });

  const res = createMockRes();
  await controller.getRepairSummary({ validatedQuery }, res);

  assert.equal(receivedQuery, validatedQuery);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {
    success: true,
    message: "Lấy báo cáo thống kê sửa chữa thành công.",
    data: {
      range: validatedQuery,
      timeseries: {
        items: [{ label: "2026-01", repairOrderCount: 5 }],
        totalRepairOrders: 5,
      },
      statusBreakdown: {
        receiving: 1,
        inProgress: 1,
        completed: 2,
        cancelled: 1,
        total: 5,
      },
      topTechnician: {
        technicianId: 10,
        repairOrderCount: 3,
      },
    },
  });

  assert.equal("averageRepairDuration" in res.body.data, false);
});

test("repair report controller propagate loi 4xx tu service", async () => {
  const createRepairReportController = await loadCreateRepairReportController();
  const controller = createRepairReportController({
    getRepairSummary: async () => {
      const error = new Error("Khoảng thời gian không hợp lệ.");
      error.status = 422;
      throw error;
    },
  });

  const res = createMockRes();
  await controller.getRepairSummary({ validatedQuery: {} }, res);

  assert.equal(res.statusCode, 422);
  assert.deepEqual(res.body, {
    success: false,
    message: "Khoảng thời gian không hợp lệ.",
  });
});

test("repair report controller tra message generic voi loi 5xx", async () => {
  const createRepairReportController = await loadCreateRepairReportController();
  const controller = createRepairReportController({
    getRepairSummary: async () => {
      const error = new Error("Database exploded");
      error.status = 500;
      throw error;
    },
  });

  const res = createMockRes();
  await controller.getRepairSummary({ validatedQuery: {} }, res);

  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, {
    success: false,
    message: "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.",
  });
});
