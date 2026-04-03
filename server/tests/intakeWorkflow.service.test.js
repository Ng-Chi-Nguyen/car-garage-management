import test from "node:test";
import assert from "node:assert/strict";

process.env.DATABASE_URL ??= "mysql://user:pass@localhost:3306/test";

const { createIntakeWorkflowService } = await import("../src/services/workflows/intakeWorkflow.service.js");

test("intake workflow service normalizes intake payload and returns empty history", async () => {
  const calls = [];
  const service = createIntakeWorkflowService({
    db: {
      kHACH_HANG: {
        findUnique: async ({ where }) => {
          calls.push(["customer", where]);
          return { MaKH: where.MaKH };
        },
      },
      xE: {
        findUnique: async ({ where }) => {
          calls.push(["vehicle", where]);
          return { MaXe: where.MaXe, MaKH: 1 };
        },
      },
      pHIEU_SUA_CHUA: {
        create: async ({ data }) => {
          calls.push(["create", data]);
          return { MaPhieuSC: 1, ...data };
        },
      },
    },
  });

  const result = await service.createIntakeAtomic({
    MaKH: 1,
    MaXe: 2,
    MaNV: 3,
    NgayTiepNhan: new Date("2026-03-25"),
    TrangThai: "TiepNhan",
  });

  assert.deepEqual(result, {
    intake: {
      id: 1,
      customerId: 1,
      vehicleId: 2,
      employeeId: 3,
      receivedAt: new Date("2026-03-25"),
      status: "TiepNhan",
      issueDescription: null,
      quickTags: [],
      note: null,
      GhiChu: JSON.stringify({ quickTags: [], note: null }),
    },
    history: [
      {
        MaPhieuSC: 1,
        MaXe: 2,
        MaNV: 3,
        NgaySC: new Date("2026-03-25"),
        TrangThai: "TiepNhan",
        NoiDungLoi: null,
        GhiChu: JSON.stringify({ quickTags: [], note: null }),
        TongTien: 0,
      },
    ],
  });
  assert.deepEqual(calls[0][0], "vehicle");
  assert.deepEqual(calls[1][0], "customer");
  assert.deepEqual(calls[2][0], "create");
});

test("intake workflow service throws 404 when vehicle or customer is missing", async () => {
  const service = createIntakeWorkflowService({
    db: {
      kHACH_HANG: {
        findUnique: async () => null,
      },
      xE: {
        findUnique: async () => null,
      },
    },
  });

  await assert.rejects(
    service.createIntakeAtomic({
      MaKH: 1,
      MaXe: 2,
      NgayTiepNhan: new Date("2026-03-25"),
      TrangThai: "TiepNhan",
    }),
    /Không tìm thấy xe/,
  );
});

test("intake workflow service maps quick tags to GhiChu text and keeps NoiDungLoi", async () => {
  let createdRepairOrder = null;
  const service = createIntakeWorkflowService({
    db: {
      kHACH_HANG: {
        findUnique: async () => ({ MaKH: 5 }),
      },
      xE: {
        findUnique: async () => ({ MaXe: 10, MaKH: 5 }),
      },
      pHIEU_SUA_CHUA: {
        create: async ({ data }) => {
          createdRepairOrder = data;
          return { MaPhieuSC: 99, ...data };
        },
      },
    },
  });

  await service.createIntakeAtomic({
    MaKH: 5,
    MaXe: 10,
    NgayTiepNhan: new Date("2026-03-25"),
    TrangThai: "TiepNhan",
    NoiDungLoi: "Xe rung khi tăng tốc",
    quickTags: ["Xước nhẹ", "Móp méo"],
    note: "Xe rung khi tăng tốc",
  });

  assert.equal(createdRepairOrder.NoiDungLoi, "Xe rung khi tăng tốc");
  assert.equal(createdRepairOrder.GhiChu, JSON.stringify({ quickTags: ["Xước nhẹ", "Móp méo"], note: "Xe rung khi tăng tốc" }));
});
