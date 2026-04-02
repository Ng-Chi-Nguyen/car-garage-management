import test from "node:test";
import assert from "node:assert/strict";

import { createActivityService } from "../src/services/activity/activity.service.js";

test("activityService builds real logs from domain records", async () => {
  const service = createActivityService({
    repairOrderDelegate: {
      findMany: async () => ([{ MaPhieuSC: 7, MaXe: 3, MaNV: 9, TrangThai: "HoanTat", NgayCapNhat: new Date("2026-04-02T09:00:00Z") }]),
    },
    paymentReceiptDelegate: {
      findMany: async () => ([]),
    },
    stockReceiptDelegate: {
      findMany: async () => ([]),
    },
    customerDelegate: {
      findMany: async () => ([]),
    },
  });

  const logs = await service.getActivityLogs();

  assert.equal(logs[0].id, "repair-7");
  assert.equal(logs[0].status, "success");
  assert.match(logs[0].actionType, /Phiếu sửa chữa/);
});

test("activityService derives stats from generated logs", async () => {
  const service = createActivityService({
    repairOrderDelegate: { findMany: async () => ([] ) },
    paymentReceiptDelegate: { findMany: async () => ([] ) },
    stockReceiptDelegate: { findMany: async () => ([] ) },
    customerDelegate: { findMany: async () => ([] ) },
  });

  const stats = await service.getActivityStats();

  assert.deepEqual(stats, {
    totalActions: 0,
    trend: "+0.0%",
    activeUsers: 0,
    errors: 0,
    successRate: "0%",
  });
});
