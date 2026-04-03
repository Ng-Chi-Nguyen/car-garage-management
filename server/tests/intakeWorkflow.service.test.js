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

test("intake workflow service creates missing records for new vehicle intake", async () => {
  let customerCalls = 0;
  let vehicleCreateCalls = 0;
  let customerCreateCalls = 0;
  const service = createIntakeWorkflowService({
    db: {
      kHACH_HANG: {
        findUnique: async () => {
          customerCalls += 1;
          return null;
        },
        create: async ({ data }) => {
          customerCreateCalls += 1;
          return { MaKH: 1, ...data };
        },
      },
      xE: {
        findUnique: async () => null,
        create: async ({ data }) => {
          vehicleCreateCalls += 1;
          return { MaXe: 2, ...data };
        },
      },
      pHIEU_SUA_CHUA: {
        create: async ({ data }) => ({ MaPhieuSC: 1, ...data }),
      },
    },
  });

  await assert.doesNotReject(
    service.createIntakeAtomic({
      MaKH: 1,
      MaXe: 2,
      NgayTiepNhan: new Date("2026-03-25"),
      TrangThai: "TiepNhan",
      BienSo: "51G-123.45",
      customer: { TenChuXe: "Nguyen Van A", DienThoai: "0900000000" },
      vehicle: { BienSo: "51G-123.45" },
    }),
  );

  assert.equal(customerCalls, 0);
  assert.equal(customerCreateCalls, 1);
  assert.equal(vehicleCreateCalls, 1);
});
