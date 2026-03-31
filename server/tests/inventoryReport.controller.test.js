import test from "node:test";
import assert from "node:assert/strict";

import { loadCreateInventoryReportController } from "./helpers/inventoryReport.test-helpers.js";

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

test("inventory report controller tra success contract", async () => {
  const createInventoryReportController = await loadCreateInventoryReportController();
  let receivedQuery;
  const validatedQuery = {
    from: "2026-03-01",
    to: "2026-03-31",
  };
  const serviceData = {
    range: validatedQuery,
    stockMovement: {
      totals: {
        openingQuantity: 10,
        importedQuantity: 5,
        exportedQuantity: 3,
        closingQuantity: 12,
      },
      items: [],
    },
    mostUsedParts: [],
    lowStockParts: [],
    currentInventoryValue: {
      totalValue: 100000,
      totalQuantity: 12,
      partCount: 1,
    },
    topSupplier: null,
  };

  const controller = createInventoryReportController({
    getInventorySummary: async (query) => {
      receivedQuery = query;
      return serviceData;
    },
  });

  const res = createMockRes();
  await controller.getInventorySummary({ validatedQuery }, res);

  assert.equal(receivedQuery, validatedQuery);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {
    success: true,
    message: "Lay bao cao thong ke kho phu tung thanh cong.",
    data: serviceData,
  });
});

test("inventory report controller propagate loi 4xx", async () => {
  const createInventoryReportController = await loadCreateInventoryReportController();
  const controller = createInventoryReportController({
    getInventorySummary: async () => {
      const error = new Error("Khoang thoi gian khong hop le.");
      error.status = 422;
      throw error;
    },
  });

  const res = createMockRes();
  await controller.getInventorySummary({ validatedQuery: {} }, res);

  assert.equal(res.statusCode, 422);
  assert.deepEqual(res.body, {
    success: false,
    message: "Khoang thoi gian khong hop le.",
  });
});
