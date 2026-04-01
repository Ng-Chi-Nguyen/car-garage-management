import test from "node:test";
import assert from "node:assert/strict";

process.env.DATABASE_URL ||= "mysql://user:pass@localhost:3306/test";

const loadPrisma = async () => {
  const module = await import("../src/db/prisma.js");
  return module.default;
};

const loadService = async () => {
  const module = await import("../src/services/management/paymentReceipt.service.js");
  return module.default;
};

const cloneValue = (value) => structuredClone(value);

const createPaymentReceiptDb = (initialState) => {
  const state = cloneValue(initialState);
  const calls = { tx: [], aggregate: [], update: [], delete: [], vehicleUpdate: [] };

  const tx = {
    pHIEU_SUA_CHUA: {
      aggregate: async ({ where }) => {
        calls.aggregate.push(["repair", cloneValue(where)]);
        return { _sum: { TongTien: state.repairTotals.get(Number(where.MaXe)) ?? 0 } };
      },
    },
    pHIEU_THU_TIEN: {
      aggregate: async ({ where }) => {
        calls.aggregate.push(["payment", cloneValue(where)]);
        const total = state.payments
          .filter((payment) => payment.MaXe === Number(where.MaXe))
          .filter((payment) => payment.TrangThai === where.TrangThai)
          .filter((payment) => {
            if (!where.MaPhieuThu?.not) return true;
            return payment.MaPhieuThu !== Number(where.MaPhieuThu.not);
          })
          .reduce((sum, payment) => sum + payment.SoTienThu, 0);
        return { _sum: { SoTienThu: total } };
      },
      create: async ({ data }) => {
        const record = { MaPhieuThu: state.nextPaymentId++, ...cloneValue(data) };
        state.payments.push(record);
        return cloneValue(record);
      },
      findUnique: async ({ where }) => cloneValue(state.payments.find((item) => item.MaPhieuThu === Number(where.MaPhieuThu)) ?? null),
      update: async ({ where, data }) => {
        calls.update.push([Number(where.MaPhieuThu), cloneValue(data)]);
        const record = state.payments.find((item) => item.MaPhieuThu === Number(where.MaPhieuThu));
        Object.assign(record, data);
        return cloneValue(record);
      },
      delete: async ({ where }) => {
        calls.delete.push(Number(where.MaPhieuThu));
        const index = state.payments.findIndex((item) => item.MaPhieuThu === Number(where.MaPhieuThu));
        const [record] = state.payments.splice(index, 1);
        return cloneValue(record);
      },
    },
    xE: {
      findUnique: async ({ where }) => cloneValue(state.vehicles.find((item) => item.MaXe === Number(where.MaXe)) ?? null),
      update: async ({ where, data }) => {
        calls.vehicleUpdate.push([Number(where.MaXe), cloneValue(data)]);
        const vehicle = state.vehicles.find((item) => item.MaXe === Number(where.MaXe));
        Object.assign(vehicle, data);
        return cloneValue(vehicle);
      },
    },
  };

  const fakePrisma = {
    ...tx,
    $transaction: async (callback, options) => {
      calls.tx.push(options);
      const snapshot = cloneValue(state);
      try {
        return await callback(tx);
      } catch (error) {
        Object.assign(state, snapshot);
        throw error;
      }
    },
  };

  return { state, calls, fakePrisma };
};

test("updatePaymentReceipt excludes the current payment and resyncs both vehicles on change", async () => {
  const fixture = createPaymentReceiptDb({
    nextPaymentId: 10,
    repairTotals: new Map([[1, 500000], [2, 250000]]),
    vehicles: [{ MaXe: 1, TienNoHienTai: 0 }, { MaXe: 2, TienNoHienTai: 0 }],
    payments: [
      { MaPhieuThu: 1, MaXe: 1, TrangThai: "DaThu", SoTienThu: 200000 },
      { MaPhieuThu: 2, MaXe: 1, TrangThai: "ChoXacNhan", SoTienThu: 50000 },
      { MaPhieuThu: 3, MaXe: 1, TrangThai: "Huy", SoTienThu: 25000 },
    ],
  });
  const service = await loadService();
  const prisma = await loadPrisma();
  const original = {
    $transaction: prisma.$transaction,
    pHIEU_SUA_CHUA: prisma.pHIEU_SUA_CHUA,
    pHIEU_THU_TIEN: prisma.pHIEU_THU_TIEN,
    xE: prisma.xE,
  };

  Object.assign(prisma, fixture.fakePrisma);

  try {
    const result = await service.updatePaymentReceipt(1, {
      MaXe: 2,
      MaNV: 7,
      NgayThu: new Date("2026-04-01"),
      SoTienThu: 100000,
      TrangThai: "ChoXacNhan",
    });

    assert.equal(result.MaXe, 2);
    assert.deepEqual(fixture.calls.aggregate, [
      ["repair", { MaXe: 2 }],
      ["payment", { MaXe: 2, TrangThai: "DaThu" }],
      ["repair", { MaXe: 1 }],
      ["payment", { MaXe: 1, TrangThai: "DaThu" }],
      ["repair", { MaXe: 2 }],
      ["payment", { MaXe: 2, TrangThai: "DaThu" }],
    ]);
    assert.deepEqual(fixture.calls.update, [[1, { MaXe: 2, MaNV: 7, NgayThu: new Date("2026-04-01"), SoTienThu: 100000, TrangThai: "ChoXacNhan" }]]);
    assert.deepEqual(fixture.calls.vehicleUpdate, [[1, { TienNoHienTai: 500000 }], [2, { TienNoHienTai: 250000 }]]);
  } finally {
    Object.assign(prisma, original);
  }
});

test("deletePaymentReceipt resyncs the source vehicle after removing the payment", async () => {
  const fixture = createPaymentReceiptDb({
    nextPaymentId: 10,
    repairTotals: new Map([[1, 500000]]),
    vehicles: [{ MaXe: 1, TienNoHienTai: 0 }],
    payments: [{ MaPhieuThu: 1, MaXe: 1, TrangThai: "DaThu", SoTienThu: 100000 }],
  });
  const service = await loadService();
  const prisma = await loadPrisma();
  const original = {
    $transaction: prisma.$transaction,
    pHIEU_SUA_CHUA: prisma.pHIEU_SUA_CHUA,
    pHIEU_THU_TIEN: prisma.pHIEU_THU_TIEN,
    xE: prisma.xE,
  };

  Object.assign(prisma, fixture.fakePrisma);

  try {
    const result = await service.deletePaymentReceipt(1);

    assert.equal(result.MaPhieuThu, 1);
    assert.deepEqual(fixture.calls.delete, [1]);
    assert.deepEqual(fixture.calls.vehicleUpdate, [[1, { TienNoHienTai: 500000 }]]);
  } finally {
    Object.assign(prisma, original);
  }
});

test("createPaymentReceipt accepts nested paymentReceipt payload and creates the record", async () => {
  const fixture = createPaymentReceiptDb({
    nextPaymentId: 4,
    repairTotals: new Map([[7, 300000]]),
    vehicles: [{ MaXe: 7, TienNoHienTai: 300000 }],
    payments: [],
  });
  const service = await loadService();
  const prisma = await loadPrisma();
  const original = {
    $transaction: prisma.$transaction,
    pHIEU_SUA_CHUA: prisma.pHIEU_SUA_CHUA,
    pHIEU_THU_TIEN: prisma.pHIEU_THU_TIEN,
    xE: prisma.xE,
  };

  Object.assign(prisma, fixture.fakePrisma);

  try {
    const result = await service.createPaymentReceipt({
      paymentReceipt: {
        MaXe: "7",
        MaNV: null,
        NgayThu: new Date("2026-04-01"),
        SoTienThu: "120000",
        PhuongThucThu: "TienMat",
        TrangThai: "DaThu",
        GhiChu: "Thanh toan",
      },
    });

    assert.equal(result.MaPhieuThu, 4);
    assert.equal(fixture.state.payments.length, 1);
    assert.equal(fixture.state.payments[0].MaXe, 7);
    assert.equal(fixture.state.payments[0].SoTienThu, 120000);
  } finally {
    Object.assign(prisma, original);
  }
});

test("createPaymentReceipt rejects malformed payload with 400 instead of 500", async () => {
  const fixture = createPaymentReceiptDb({
    nextPaymentId: 1,
    repairTotals: new Map(),
    vehicles: [],
    payments: [],
  });
  const service = await loadService();
  const prisma = await loadPrisma();
  const original = {
    $transaction: prisma.$transaction,
    pHIEU_SUA_CHUA: prisma.pHIEU_SUA_CHUA,
    pHIEU_THU_TIEN: prisma.pHIEU_THU_TIEN,
    xE: prisma.xE,
  };

  Object.assign(prisma, fixture.fakePrisma);

  try {
    await assert.rejects(
      service.createPaymentReceipt({
        paymentReceipt: {
          MaXe: 7,
          NgayThu: new Date("2026-04-01"),
          SoTienThu: -1,
        },
      }),
      (error) => error.status === 400 && error.message === "Dữ liệu phiếu thu tiền không hợp lệ.",
    );
  } finally {
    Object.assign(prisma, original);
  }
});
