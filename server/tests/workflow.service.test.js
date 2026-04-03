import test from "node:test";
import assert from "node:assert/strict";

import {
  createPaymentReceiptWorkflowService,
} from "../src/services/workflows/paymentReceiptWorkflow.service.js";
import {
  createRepairOrderWorkflowService,
} from "../src/services/workflows/repairOrderWorkflow.service.js";
import {
  createStockReceiptWorkflowService,
} from "../src/services/workflows/stockReceiptWorkflow.service.js";

const cloneValue = (value) => structuredClone(value);

const applySnapshot = (target, snapshot) => {
  for (const key of Object.keys(target)) {
    delete target[key];
  }

  for (const [key, value] of Object.entries(snapshot)) {
    target[key] = cloneValue(value);
  }
};

const selectFields = (record, select) => {
  if (!record) {
    return null;
  }

  if (!select) {
    return cloneValue(record);
  }

  return Object.fromEntries(
    Object.entries(select)
      .filter(([, enabled]) => enabled)
      .map(([field]) => [field, cloneValue(record[field])]),
  );
};

const nextId = (items, key) => {
  return items.reduce((maxId, item) => Math.max(maxId, Number(item[key] ?? 0)), 0) + 1;
};

const createWorkflowDb = (initialState) => {
  const state = cloneValue(initialState);
  const transactionOptions = [];

  const tx = {
    xE: {
      findUnique: async ({ where, select }) => {
        const record = state.vehicles.find((item) => item.MaXe === Number(where.MaXe));
        return selectFields(record, select);
      },
    },
    vAT_TU: {
      findMany: async ({ where, select }) => {
        const ids = (where?.MaVatTu?.in ?? []).map(Number);
        return state.parts
          .filter((item) => ids.includes(Number(item.MaVatTu)))
          .map((item) => selectFields(item, select));
      },
    },
    tIEN_CONG: {
      findMany: async ({ where, select }) => {
        const ids = (where?.MaTienCong?.in ?? []).map(Number);
        return state.laborFees
          .filter((item) => ids.includes(Number(item.MaTienCong)))
          .map((item) => selectFields(item, select));
      },
    },
    nHA_CUNG_CAP: {
      findUnique: async ({ where, select }) => {
        const record = state.suppliers.find((item) => item.MaNCC === Number(where.MaNCC));
        return selectFields(record, select);
      },
    },
    pHIEU_SUA_CHUA: {
      create: async ({ data }) => {
        const record = { MaPhieuSC: nextId(state.repairOrders, "MaPhieuSC"), ...cloneValue(data) };
        state.repairOrders.push(record);
        return cloneValue(record);
      },
      findUnique: async ({ where, select }) => {
        const record = state.repairOrders.find((item) => item.MaPhieuSC === Number(where.MaPhieuSC));
        return selectFields(record, select);
      },
    },
    cT_PHIEU_SUA_CHUA: {
      createMany: async ({ data }) => {
        data.forEach((item) => {
          state.repairOrderDetails.push({
            MaCTSC: nextId(state.repairOrderDetails, "MaCTSC"),
            ...cloneValue(item),
          });
        });

        return { count: data.length };
      },
      findMany: async ({ where }) => {
        return state.repairOrderDetails
          .filter((item) => item.MaPhieuSC === Number(where.MaPhieuSC))
          .map((item) => cloneValue(item));
      },
    },
    pHIEU_NHAP_KHO: {
      create: async ({ data }) => {
        const record = { MaPhieuNhap: nextId(state.stockReceipts, "MaPhieuNhap"), ...cloneValue(data) };
        state.stockReceipts.push(record);
        return cloneValue(record);
      },
      findUnique: async ({ where }) => {
        const record = state.stockReceipts.find((item) => item.MaPhieuNhap === Number(where.MaPhieuNhap));
        return cloneValue(record ?? null);
      },
    },
    cT_PHIEU_NHAP: {
      createMany: async ({ data }) => {
        data.forEach((item) => {
          state.stockReceiptDetails.push({
            MaCTPN: nextId(state.stockReceiptDetails, "MaCTPN"),
            ...cloneValue(item),
          });
        });

        return { count: data.length };
      },
      findMany: async ({ where }) => {
        return state.stockReceiptDetails
          .filter((item) => item.MaPhieuNhap === Number(where.MaPhieuNhap))
          .map((item) => cloneValue(item));
      },
    },
    pHIEU_THU_TIEN: {
      create: async ({ data }) => {
        const record = { MaPhieuThu: nextId(state.paymentReceipts, "MaPhieuThu"), ...cloneValue(data) };
        state.paymentReceipts.push(record);
        return cloneValue(record);
      },
    },
  };

  return {
    state,
    tx,
    transactionOptions,
    db: {
      $transaction: async (callback, options) => {
        transactionOptions.push(options);
        const snapshot = cloneValue(state);

        try {
          return await callback(tx);
        } catch (error) {
          applySnapshot(state, snapshot);
          throw error;
        }
      },
    },
  };
};

test("repair order workflow tao header va details trong cung transaction", async () => {
  const fixture = createWorkflowDb({
    vehicles: [{ MaXe: 1, TienNoHienTai: 0 }],
    parts: [
      { MaVatTu: 10, SoLuongTon: 10 },
      { MaVatTu: 11, SoLuongTon: 5 },
    ],
    laborFees: [
      { MaTienCong: 20 },
      { MaTienCong: 21 },
    ],
    suppliers: [],
    repairOrders: [],
    repairOrderDetails: [],
    stockReceipts: [],
    stockReceiptDetails: [],
    paymentReceipts: [],
  });
  const helperCalls = [];
  const service = createRepairOrderWorkflowService({
    db: fixture.db,
    businessHelpers: {
      adjustPartStock: async (txArg, maVatTu, quantityDelta) => {
        helperCalls.push(["adjustPartStock", txArg, maVatTu, quantityDelta]);
        const part = fixture.state.parts.find((item) => item.MaVatTu === Number(maVatTu));
        part.SoLuongTon += Number(quantityDelta);
      },
      syncRepairOrderTotal: async (txArg, maPhieuSC) => {
        helperCalls.push(["syncRepairOrderTotal", txArg, maPhieuSC]);
        const total = fixture.state.repairOrderDetails
          .filter((item) => item.MaPhieuSC === Number(maPhieuSC))
          .reduce((sum, item) => sum + Number(item.ThanhTien), 0);
        const repairOrder = fixture.state.repairOrders.find((item) => item.MaPhieuSC === Number(maPhieuSC));
        repairOrder.TongTien = total;
      },
    },
  });

  const result = await service.createRepairOrderAtomic({
    repairOrder: {
      MaXe: 1,
      MaNV: 2,
      NgaySC: new Date("2026-03-25"),
      TrangThai: "TiepNhan",
      NoiDungLoi: "De may",
      GhiChu: "Workflow",
    },
    details: [
      {
        MaVatTu: 10,
        MaTienCong: 20,
        SoLuong: 2,
        DonGiaVatTu: 100000,
        DonGiaTienCong: 50000,
      },
      {
        MaVatTu: 11,
        MaTienCong: 21,
        SoLuong: 1,
        DonGiaVatTu: 70000,
        DonGiaTienCong: 30000,
      },
    ],
  });

  assert.equal(fixture.transactionOptions.length, 1);
  assert.equal(result.repairOrder.MaPhieuSC, 1);
  assert.equal(result.repairOrder.TongTien, 350000);
  assert.equal(result.repairOrderDetails.length, 2);
  assert.ok(helperCalls.every(([, txArg]) => txArg === fixture.tx));
  assert.deepEqual(
    helperCalls.map(([name, , id, delta]) => [name, id, delta]),
    [
      ["adjustPartStock", 10, -2],
      ["adjustPartStock", 11, -1],
      ["syncRepairOrderTotal", 1, undefined],
    ],
  );
  assert.equal(fixture.state.parts[0].SoLuongTon, 8);
  assert.equal(fixture.state.parts[1].SoLuongTon, 4);
});

test("repair order workflow rollback state khi loi xay ra giua transaction", async () => {
  const fixture = createWorkflowDb({
    vehicles: [{ MaXe: 1, TienNoHienTai: 0 }],
    parts: [{ MaVatTu: 10, SoLuongTon: 10 }],
    laborFees: [{ MaTienCong: 20 }],
    suppliers: [],
    repairOrders: [],
    repairOrderDetails: [],
    stockReceipts: [],
    stockReceiptDetails: [],
    paymentReceipts: [],
  });
  const service = createRepairOrderWorkflowService({
    db: fixture.db,
    businessHelpers: {
      adjustPartStock: async (txArg, maVatTu, quantityDelta) => {
        const part = fixture.state.parts.find((item) => item.MaVatTu === Number(maVatTu));
        part.SoLuongTon += Number(quantityDelta);
        throw new Error(`stock fail ${txArg === fixture.tx}`);
      },
      syncRepairOrderTotal: async () => {
        throw new Error("should not reach syncRepairOrderTotal");
      },
    },
  });

  await assert.rejects(
    service.createRepairOrderAtomic({
      repairOrder: {
        MaXe: 1,
        MaNV: null,
        NgaySC: new Date("2026-03-25"),
      },
      details: [
        {
          MaVatTu: 10,
          MaTienCong: 20,
          SoLuong: 2,
          DonGiaVatTu: 100000,
          DonGiaTienCong: 50000,
        },
      ],
    }),
    /stock fail true/,
  );

  assert.equal(fixture.state.repairOrders.length, 0);
  assert.equal(fixture.state.repairOrderDetails.length, 0);
  assert.equal(fixture.state.parts[0].SoLuongTon, 10);
});

test("repair order workflow doc lai phieu sua chua bang select khong gom NgayKetThuc", async () => {
  const fixture = createWorkflowDb({
    vehicles: [{ MaXe: 1, TienNoHienTai: 0 }],
    parts: [{ MaVatTu: 10, SoLuongTon: 10 }],
    laborFees: [{ MaTienCong: 20 }],
    suppliers: [],
    repairOrders: [],
    repairOrderDetails: [],
    stockReceipts: [],
    stockReceiptDetails: [],
    paymentReceipts: [],
  });
  const expectedSelect = {
    MaPhieuSC: true,
    MaXe: true,
    MaNV: true,
    NgaySC: true,
    TrangThai: true,
    NoiDungLoi: true,
    GhiChu: true,
    TongTien: true,
    NgayTao: true,
    NgayCapNhat: true,
  };
  let capturedSelect;

  fixture.tx.pHIEU_SUA_CHUA.findUnique = async ({ where, select }) => {
    capturedSelect = cloneValue(select);
    if (!select) {
      throw new Error("Expected select in pHIEU_SUA_CHUA.findUnique");
    }

    if (Object.hasOwn(select, "NgayKetThuc")) {
      throw new Error("Unexpected NgayKetThuc in pHIEU_SUA_CHUA.findUnique select");
    }

    const record = fixture.state.repairOrders.find((item) => item.MaPhieuSC === Number(where.MaPhieuSC));
    return selectFields(record, select);
  };

  const service = createRepairOrderWorkflowService({
    db: fixture.db,
    businessHelpers: {
      adjustPartStock: async (_txArg, maVatTu, quantityDelta) => {
        const part = fixture.state.parts.find((item) => item.MaVatTu === Number(maVatTu));
        part.SoLuongTon += Number(quantityDelta);
      },
      syncRepairOrderTotal: async (_txArg, maPhieuSC) => {
        const total = fixture.state.repairOrderDetails
          .filter((item) => item.MaPhieuSC === Number(maPhieuSC))
          .reduce((sum, item) => sum + Number(item.ThanhTien), 0);
        const repairOrder = fixture.state.repairOrders.find((item) => item.MaPhieuSC === Number(maPhieuSC));
        repairOrder.TongTien = total;
      },
    },
  });

  await service.createRepairOrderAtomic({
    repairOrder: {
      MaXe: 1,
      MaNV: 2,
      NgaySC: new Date("2026-03-25"),
      TrangThai: "TiepNhan",
      NoiDungLoi: "De may",
      GhiChu: "Regression",
    },
    details: [
      {
        MaVatTu: 10,
        MaTienCong: 20,
        SoLuong: 1,
        DonGiaVatTu: 100000,
        DonGiaTienCong: 50000,
      },
    ],
  });

  assert.deepEqual(capturedSelect, expectedSelect);
  assert.equal(Object.hasOwn(capturedSelect, "NgayKetThuc"), false);
});

test("stock receipt workflow tao phieu nhap va cong ton bang tx helper", async () => {
  const fixture = createWorkflowDb({
    vehicles: [],
    parts: [
      { MaVatTu: 10, SoLuongTon: 3 },
      { MaVatTu: 11, SoLuongTon: 1 },
    ],
    laborFees: [],
    suppliers: [{ MaNCC: 5 }],
    repairOrders: [],
    repairOrderDetails: [],
    stockReceipts: [],
    stockReceiptDetails: [],
    paymentReceipts: [],
  });
  const helperCalls = [];
  const service = createStockReceiptWorkflowService({
    db: fixture.db,
    businessHelpers: {
      adjustPartStock: async (txArg, maVatTu, quantityDelta) => {
        helperCalls.push(["adjustPartStock", txArg, maVatTu, quantityDelta]);
        const part = fixture.state.parts.find((item) => item.MaVatTu === Number(maVatTu));
        part.SoLuongTon += Number(quantityDelta);
      },
      syncStockReceiptTotal: async (txArg, maPhieuNhap) => {
        helperCalls.push(["syncStockReceiptTotal", txArg, maPhieuNhap]);
        const total = fixture.state.stockReceiptDetails
          .filter((item) => item.MaPhieuNhap === Number(maPhieuNhap))
          .reduce((sum, item) => sum + Number(item.ThanhTien), 0);
        const stockReceipt = fixture.state.stockReceipts.find((item) => item.MaPhieuNhap === Number(maPhieuNhap));
        stockReceipt.TongTien = total;
      },
    },
  });

  const result = await service.createStockReceiptAtomic({
    stockReceipt: {
      MaNCC: 5,
      NgayNhap: new Date("2026-03-25"),
    },
    details: [
      { MaVatTu: 10, SoLuong: 4, DonGiaNhap: 120000 },
      { MaVatTu: 11, SoLuong: 2, DonGiaNhap: 100000 },
    ],
  });

  assert.equal(result.stockReceipt.MaPhieuNhap, 1);
  assert.equal(result.stockReceipt.TongTien, 680000);
  assert.equal(result.stockReceiptDetails.length, 2);
  assert.ok(helperCalls.every(([, txArg]) => txArg === fixture.tx));
  assert.equal(fixture.state.parts[0].SoLuongTon, 7);
  assert.equal(fixture.state.parts[1].SoLuongTon, 3);
});

test("stock receipt workflow rollback state khi helper ton kho bi loi", async () => {
  const fixture = createWorkflowDb({
    vehicles: [],
    parts: [{ MaVatTu: 10, SoLuongTon: 3 }],
    laborFees: [],
    suppliers: [{ MaNCC: 5 }],
    repairOrders: [],
    repairOrderDetails: [],
    stockReceipts: [],
    stockReceiptDetails: [],
    paymentReceipts: [],
  });
  const service = createStockReceiptWorkflowService({
    db: fixture.db,
    businessHelpers: {
      adjustPartStock: async (txArg, maVatTu, quantityDelta) => {
        const part = fixture.state.parts.find((item) => item.MaVatTu === Number(maVatTu));
        part.SoLuongTon += Number(quantityDelta);
        throw new Error(`stock receipt fail ${txArg === fixture.tx}`);
      },
      syncStockReceiptTotal: async () => {
        throw new Error("should not reach syncStockReceiptTotal");
      },
    },
  });

  await assert.rejects(
    service.createStockReceiptAtomic({
      stockReceipt: {
        MaNCC: 5,
        NgayNhap: new Date("2026-03-25"),
      },
      details: [{ MaVatTu: 10, SoLuong: 2, DonGiaNhap: 120000 }],
    }),
    /stock receipt fail true/,
  );

  assert.equal(fixture.state.stockReceipts.length, 0);
  assert.equal(fixture.state.stockReceiptDetails.length, 0);
  assert.equal(fixture.state.parts[0].SoLuongTon, 3);
});

test("payment receipt workflow tao phieu thu va goi helper voi cung tx", async () => {
  const fixture = createWorkflowDb({
    vehicles: [{ MaXe: 7, TienNoHienTai: 300000 }],
    parts: [],
    laborFees: [],
    suppliers: [],
    repairOrders: [],
    repairOrderDetails: [],
    stockReceipts: [],
    stockReceiptDetails: [],
    paymentReceipts: [],
  });
  const helperCalls = [];
  const service = createPaymentReceiptWorkflowService({
    db: fixture.db,
    businessHelpers: {
      ensurePaymentWithinDebt: async (txArg, maXe, soTienThu) => {
        helperCalls.push(["ensurePaymentWithinDebt", txArg, maXe, soTienThu]);
      },
      syncVehicleDebt: async (txArg, maXe) => {
        helperCalls.push(["syncVehicleDebt", txArg, maXe]);
      },
    },
  });

  const result = await service.createPaymentReceiptAtomic({
    paymentReceipt: {
      MaXe: 7,
      MaNV: 3,
      NgayThu: new Date("2026-03-25"),
      SoTienThu: 150000,
      PhuongThucThu: "TienMat",
      TrangThai: "DaThu",
      GhiChu: "Workflow",
    },
  });

  assert.equal(result.paymentReceipt.MaPhieuThu, 1);
  assert.ok(helperCalls.every(([, txArg]) => txArg === fixture.tx));
  assert.deepEqual(
    helperCalls.map(([name, , id, amount]) => [name, id, amount]),
    [
      ["ensurePaymentWithinDebt", 7, 150000],
      ["syncVehicleDebt", 7, undefined],
    ],
  );
});

test("payment receipt workflow rollback phieu thu khi dong bo cong no that bai", async () => {
  const fixture = createWorkflowDb({
    vehicles: [{ MaXe: 7, TienNoHienTai: 300000 }],
    parts: [],
    laborFees: [],
    suppliers: [],
    repairOrders: [],
    repairOrderDetails: [],
    stockReceipts: [],
    stockReceiptDetails: [],
    paymentReceipts: [],
  });
  const service = createPaymentReceiptWorkflowService({
    db: fixture.db,
    businessHelpers: {
      ensurePaymentWithinDebt: async () => {},
      syncVehicleDebt: async (txArg) => {
        throw new Error(`sync debt fail ${txArg === fixture.tx}`);
      },
    },
  });

  await assert.rejects(
    service.createPaymentReceiptAtomic({
      paymentReceipt: {
        MaXe: 7,
        MaNV: 3,
        NgayThu: new Date("2026-03-25"),
        SoTienThu: 150000,
      },
    }),
    /sync debt fail true/,
  );

  assert.equal(fixture.state.paymentReceipts.length, 0);
});

test("payment receipt workflow bao loi structured khi thu vuot cong no", async () => {
  const state = {
    vehicles: [{ MaXe: 7, TienNoHienTai: 300000 }],
    repairOrders: [{ MaPhieuSC: 1, MaXe: 7, TongTien: 300000 }],
    paymentReceipts: [],
  };
  const service = createPaymentReceiptWorkflowService({
    db: {
      $transaction: async (callback) => callback({
        xE: {
          findUnique: async ({ where, select }) => {
            const record = state.vehicles.find((item) => item.MaXe === Number(where.MaXe));
            return selectFields(record, select);
          },
        },
        pHIEU_SUA_CHUA: {
          aggregate: async ({ where }) => ({
            _sum: {
              TongTien: state.repairOrders
                .filter((item) => item.MaXe === Number(where.MaXe))
                .reduce((sum, item) => sum + Number(item.TongTien ?? 0), 0),
            },
          }),
        },
        pHIEU_THU_TIEN: {
          aggregate: async ({ where }) => ({
            _sum: {
              SoTienThu: state.paymentReceipts
                .filter((item) => item.MaXe === Number(where.MaXe) && item.TrangThai === "DaThu")
                .reduce((sum, item) => sum + Number(item.SoTienThu ?? 0), 0),
            },
          }),
          create: async ({ data }) => {
            const record = { MaPhieuThu: 1, ...cloneValue(data) };
            state.paymentReceipts.push(record);
            return cloneValue(record);
          },
        },
      }),
    },
  });

  await assert.rejects(
    service.createPaymentReceiptAtomic({
      paymentReceipt: {
        MaXe: 7,
        MaNV: 3,
        NgayThu: new Date("2026-03-25"),
        SoTienThu: 350000,
      },
    }),
    (error) => {
      assert.equal(error.status, 400);
      assert.equal(error.message, "Số tiền thu không được vượt quá số tiền nợ hiện tại.");
      assert.equal(error.errorCode, "PAYMENT_RECEIPT_OVERPAYMENT");
      assert.deepEqual(error.details, {
        availableDebt: 300000,
        requestedAmount: 350000,
        MaXe: 7,
      });
      return true;
    },
  );

  assert.equal(state.paymentReceipts.length, 0);
});
