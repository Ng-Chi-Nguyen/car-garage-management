import test from "node:test";
import assert from "node:assert/strict";

const ensureTestDatabaseUrl = () => {
  process.env.DATABASE_URL ??= "mysql://tester:secret@127.0.0.1:3306/garage_test";
};

ensureTestDatabaseUrl();

const loadCreateWorkflowService = async () => {
  ensureTestDatabaseUrl();
  const module = await import("../src/services/workflows/stockReceiptWorkflow.service.js");
  return module.createStockReceiptWorkflowService;
};

const cloneValue = (value) => structuredClone(value);

const createWorkflowDb = (initialState) => {
  const state = cloneValue(initialState);
  const tx = {
    nHA_CUNG_CAP: {
      findUnique: async ({ where, select }) => {
        const record = state.suppliers.find((item) => item.MaNCC === Number(where.MaNCC));
        if (!record) return null;
        return select ? Object.fromEntries(Object.keys(select).filter((key) => select[key]).map((key) => [key, cloneValue(record[key])])) : cloneValue(record);
      },
    },
    vAT_TU: {
      findMany: async ({ where, select }) => {
        const ids = (where?.MaVatTu?.in ?? []).map(Number);
        return state.parts.filter((item) => ids.includes(Number(item.MaVatTu))).map((item) => select ? Object.fromEntries(Object.keys(select).filter((key) => select[key]).map((key) => [key, cloneValue(item[key])])) : cloneValue(item));
      },
      findUnique: async ({ where, select }) => {
        const record = state.parts.find((item) => item.MaVatTu === Number(where.MaVatTu));
        if (!record) return null;
        return select ? Object.fromEntries(Object.keys(select).filter((key) => select[key]).map((key) => [key, cloneValue(record[key])])) : cloneValue(record);
      },
      updateMany: async ({ where, data }) => {
        const part = state.parts.find((item) => item.MaVatTu === Number(where.MaVatTu));
        if (!part) return { count: 0 };
        if (where.SoLuongTon?.gte != null && Number(part.SoLuongTon) < Number(where.SoLuongTon.gte)) return { count: 0 };
        part.SoLuongTon = Number(part.SoLuongTon) + Number(data.SoLuongTon.increment);
        return { count: 1 };
      },
    },
    pHIEU_NHAP_KHO: {
      create: async ({ data }) => {
        const record = { MaPhieuNhap: 1, ...cloneValue(data) };
        state.stockReceipts.push(record);
        return cloneValue(record);
      },
      findUnique: async ({ where }) => cloneValue(state.stockReceipts.find((item) => item.MaPhieuNhap === Number(where.MaPhieuNhap)) ?? null),
      update: async ({ where, data }) => {
        const record = state.stockReceipts.find((item) => item.MaPhieuNhap === Number(where.MaPhieuNhap));
        record.TongTien = Number(data.TongTien);
        return cloneValue(record);
      },
    },
    cT_PHIEU_NHAP: {
      createMany: async ({ data }) => {
        data.forEach((item, index) => state.stockReceiptDetails.push({ MaCTPN: index + 1, ...cloneValue(item) }));
        return { count: data.length };
      },
      findMany: async ({ where }) => state.stockReceiptDetails.filter((item) => item.MaPhieuNhap === Number(where.MaPhieuNhap)).map(cloneValue),
      aggregate: async ({ where }) => {
        const total = state.stockReceiptDetails.filter((item) => item.MaPhieuNhap === Number(where.MaPhieuNhap)).reduce((sum, item) => sum + Number(item.ThanhTien), 0);
        return { _sum: { ThanhTien: total } };
      },
    },
  };

  return {
    state,
    db: {
      $transaction: async (callback, options) => callback(tx, options),
    },
  };
};

test("stock receipt workflow returns Contract A shape with item stock after and totals", async () => {
  const createStockReceiptWorkflowService = await loadCreateWorkflowService();
  const fixture = createWorkflowDb({
    suppliers: [{ MaNCC: 1 }],
    parts: [{ MaVatTu: 10, SoLuongTon: 5 }],
    stockReceipts: [],
    stockReceiptDetails: [],
  });

  const service = createStockReceiptWorkflowService({ db: fixture.db });
  const result = await service.createStockReceiptAtomic({
    stockReceipt: { MaNCC: 1, NgayNhap: new Date("2026-03-30") },
    details: [{ MaVatTu: 10, SoLuong: 2, DonGiaNhap: 100000 }],
  });

  assert.deepEqual(Object.keys(result).sort(), ["items", "receipt", "totals"]);
  assert.deepEqual(result.receipt, {
    id: 1,
    supplierId: 1,
    importedAt: new Date("2026-03-30"),
    totalAmount: 200000,
  });
  assert.equal(result.items.length, 1);
  assert.deepEqual(result.items[0], {
    receiptDetailId: 1,
    partId: 10,
    quantity: 2,
    unitPrice: 100000,
    lineTotal: 200000,
    stockAfter: 7,
    inventoryValueAfter: 200000,
  });
  assert.deepEqual(result.totals, { receiptQuantity: 2, receiptAmount: 200000 });
  assert.equal(result.receipt.receiptId, undefined);
  assert.equal(result.items[0].detailId, undefined);
  assert.equal(result.items[0].importPrice, undefined);
  assert.equal(result.totals.totalQuantity, undefined);
  assert.equal(result.totals.inventoryValueAfter, undefined);
});

test("stock receipt workflow returns deterministic item order for multi-line receipts", async () => {
  const createStockReceiptWorkflowService = await loadCreateWorkflowService();
  const fixture = createWorkflowDb({
    suppliers: [{ MaNCC: 1 }],
    parts: [
      { MaVatTu: 10, SoLuongTon: 5 },
      { MaVatTu: 11, SoLuongTon: 6 },
    ],
    stockReceipts: [],
    stockReceiptDetails: [],
  });

  fixture.db.$transaction = async (callback, options) => callback(
    {
      nHA_CUNG_CAP: {
        findUnique: async ({ where, select }) => {
          const record = fixture.state.suppliers.find((item) => item.MaNCC === Number(where.MaNCC));
          if (!record) return null;
          return select ? Object.fromEntries(Object.keys(select).filter((key) => select[key]).map((key) => [key, cloneValue(record[key])])) : cloneValue(record);
        },
      },
      vAT_TU: {
        findMany: async ({ where, select }) => {
          const ids = (where?.MaVatTu?.in ?? []).map(Number);
          return fixture.state.parts.filter((item) => ids.includes(Number(item.MaVatTu))).map((item) => select ? Object.fromEntries(Object.keys(select).filter((key) => select[key]).map((key) => [key, cloneValue(item[key])])) : cloneValue(item));
        },
        updateMany: async ({ where, data }) => {
          const part = fixture.state.parts.find((item) => item.MaVatTu === Number(where.MaVatTu));
          if (!part) return { count: 0 };
          if (where.SoLuongTon?.gte != null && Number(part.SoLuongTon) < Number(where.SoLuongTon.gte)) return { count: 0 };
          part.SoLuongTon = Number(part.SoLuongTon) + Number(data.SoLuongTon.increment);
          return { count: 1 };
        },
        findUnique: async ({ where, select }) => {
          const record = fixture.state.parts.find((item) => item.MaVatTu === Number(where.MaVatTu));
          if (!record) return null;
          return select ? Object.fromEntries(Object.keys(select).filter((key) => select[key]).map((key) => [key, cloneValue(record[key])])) : cloneValue(record);
        },
      },
      pHIEU_NHAP_KHO: {
        create: async ({ data }) => {
          const record = { MaPhieuNhap: 1, ...cloneValue(data) };
          fixture.state.stockReceipts.push(record);
          return cloneValue(record);
        },
        findUnique: async ({ where }) => cloneValue(fixture.state.stockReceipts.find((item) => item.MaPhieuNhap === Number(where.MaPhieuNhap)) ?? null),
        update: async ({ where, data }) => {
          const record = fixture.state.stockReceipts.find((item) => item.MaPhieuNhap === Number(where.MaPhieuNhap));
          record.TongTien = Number(data.TongTien);
          return cloneValue(record);
        },
      },
      cT_PHIEU_NHAP: {
        createMany: async ({ data }) => {
          data.forEach((item, index) => fixture.state.stockReceiptDetails.push({ MaCTPN: index + 1, ...cloneValue(item) }));
          return { count: data.length };
        },
        aggregate: async ({ where }) => {
          const total = fixture.state.stockReceiptDetails.filter((item) => item.MaPhieuNhap === Number(where.MaPhieuNhap)).reduce((sum, item) => sum + Number(item.ThanhTien), 0);
          return { _sum: { ThanhTien: total } };
        },
        findMany: async ({ where }) => {
          const items = fixture.state.stockReceiptDetails.filter((item) => item.MaPhieuNhap === Number(where.MaPhieuNhap));
          return [items[1], items[0]].filter(Boolean).map((item) => structuredClone(item));
        },
      },
    },
    options,
  );

  const service = createStockReceiptWorkflowService({ db: fixture.db });
  const result = await service.createStockReceiptAtomic({
    stockReceipt: { MaNCC: 1, NgayNhap: new Date("2026-03-30") },
    details: [
      { MaVatTu: 10, SoLuong: 2, DonGiaNhap: 100000 },
      { MaVatTu: 11, SoLuong: 1, DonGiaNhap: 200000 },
    ],
  });

  assert.deepEqual(result.items.map((item) => item.receiptDetailId), [1, 2]);
  assert.deepEqual(result.items[0], {
    receiptDetailId: 1,
    partId: 10,
    quantity: 2,
    unitPrice: 100000,
    lineTotal: 200000,
    stockAfter: 7,
    inventoryValueAfter: 200000,
  });
  assert.deepEqual(result.items[1], {
    receiptDetailId: 2,
    partId: 11,
    quantity: 1,
    unitPrice: 200000,
    lineTotal: 200000,
    stockAfter: 7,
    inventoryValueAfter: 200000,
  });
});
