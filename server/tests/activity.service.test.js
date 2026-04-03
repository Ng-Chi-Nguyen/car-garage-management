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

  const { activityLogs, pagination } = await service.getActivityLogs({ period: "all" });

  assert.equal(activityLogs[0].id, "repair-7");
  assert.equal(activityLogs[0].status, "success");
  assert.match(activityLogs[0].actionType, /Phiếu sửa chữa/);
  assert.ok(activityLogs[0].initials);
  assert.equal(pagination.totalItems, 1);
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

test("activityService trả lỗi rõ ràng khi delegate Prisma bị timeout", async () => {
  const service = createActivityService({
    repairOrderDelegate: {
      findMany: async () => {
        throw new Error("Prisma MariaDB pool timeout (active=0 idle=0 limit=10)");
      },
    },
    paymentReceiptDelegate: { findMany: async () => ([] ) },
    stockReceiptDelegate: { findMany: async () => ([] ) },
    customerDelegate: { findMany: async () => ([] ) },
  });

  await assert.rejects(
    service.getActivityLogs({ period: "all" }),
    (error) => error.status === 503 && error.message === "Hệ thống đang quá tải hoặc không thể kết nối cơ sở dữ liệu. Vui lòng thử lại sau.",
  );
});
