import test from "node:test";
import assert from "node:assert/strict";

const ensureTestDatabaseUrl = () => {
  process.env.DATABASE_URL ??= "mysql://tester:secret@127.0.0.1:3306/garage_test";
};

ensureTestDatabaseUrl();

const loadCreateDetailService = async () => {
  ensureTestDatabaseUrl();
  const module = await import("../src/services/management/stockReceiptDetail.service.js");
  return module.createStockReceiptDetailService;
};

const cloneValue = (value) => structuredClone(value);

const createDetailDb = (initialState) => {
  const state = cloneValue(initialState);
  const tx = {
    cT_PHIEU_NHAP: {
      create: async ({ data }) => {
        const record = { MaCTPN: Math.max(0, ...state.details.map((item) => item.MaCTPN)) + 1, ...cloneValue(data) };
        state.details.push(record);
        return cloneValue(record);
      },
      findUnique: async ({ where }) => cloneValue(state.details.find((item) => item.MaCTPN === Number(where.MaCTPN)) ?? null),
      update: async ({ where, data }) => {
        const record = state.details.find((item) => item.MaCTPN === Number(where.MaCTPN));
        Object.assign(record, cloneValue(data));
        return cloneValue(record);
      },
      delete: async ({ where }) => {
        const index = state.details.findIndex((item) => item.MaCTPN === Number(where.MaCTPN));
        const [deleted] = state.details.splice(index, 1);
        return cloneValue(deleted);
      },
      aggregate: async ({ where }) => {
        const total = state.details.filter((item) => item.MaPhieuNhap === Number(where.MaPhieuNhap)).reduce((sum, item) => sum + Number(item.ThanhTien), 0);
        return { _sum: { ThanhTien: total } };
      },
    },
    vAT_TU: {
      updateMany: async ({ where, data }) => {
        const part = state.parts.find((item) => item.MaVatTu === Number(where.MaVatTu));
        if (!part) return { count: 0 };
        if (where.SoLuongTon?.gte != null && Number(part.SoLuongTon) < Number(where.SoLuongTon.gte)) return { count: 0 };
        part.SoLuongTon = Number(part.SoLuongTon) + Number(data.SoLuongTon.increment);
        return { count: 1 };
      },
      findUnique: async ({ where, select }) => {
        const part = state.parts.find((item) => item.MaVatTu === Number(where.MaVatTu));
        if (!part) return null;
        return select ? Object.fromEntries(Object.keys(select).filter((key) => select[key]).map((key) => [key, cloneValue(part[key])])) : cloneValue(part);
      },
    },
    pHIEU_NHAP_KHO: {
      findUnique: async ({ where, select }) => {
        const record = state.receipts.find((item) => item.MaPhieuNhap === Number(where.MaPhieuNhap));
        if (!record) return null;
        return select ? Object.fromEntries(Object.keys(select).filter((key) => select[key]).map((key) => [key, cloneValue(record[key])])) : cloneValue(record);
      },
      update: async ({ where, data }) => {
        const record = state.receipts.find((item) => item.MaPhieuNhap === Number(where.MaPhieuNhap));
        record.TongTien = Number(data.TongTien);
        return cloneValue(record);
      },
    },
  };

  return {
    state,
    db: {
      cT_PHIEU_NHAP: {
        count: async () => state.details.length,
        findMany: async ({ skip, take }) => cloneValue(state.details.slice(skip, skip + take)),
      },
      $transaction: async (callbackOrOperations) => (Array.isArray(callbackOrOperations) ? Promise.all(callbackOrOperations) : callbackOrOperations(tx)),
    },
  };
};

test("stock receipt detail create update delete preserve quantity transitions and response shape", async () => {
  const createStockReceiptDetailService = await loadCreateDetailService();
  const fixture = createDetailDb({
    parts: [{ MaVatTu: 10, SoLuongTon: 10 }],
    receipts: [{ MaPhieuNhap: 1, MaNCC: 1, NgayNhap: new Date("2026-03-30"), TongTien: 0 }],
    details: [{ MaCTPN: 1, MaPhieuNhap: 1, MaVatTu: 10, SoLuong: 2, DonGiaNhap: 100000, ThanhTien: 200000 }],
  });

  const service = createStockReceiptDetailService({ db: fixture.db });

  const created = await service.createStockReceiptDetail({ MaPhieuNhap: 1, MaVatTu: 10, SoLuong: 3, DonGiaNhap: 100000 });
  assert.deepEqual(Object.keys(created).sort(), ["items", "receipt", "totals"]);
  assert.deepEqual(created.receipt, {
    id: 1,
    supplierId: 1,
    importedAt: new Date("2026-03-30"),
    totalAmount: 500000,
  });
  assert.deepEqual(created.items[0], {
    receiptDetailId: 2,
    partId: 10,
    quantity: 3,
    unitPrice: 100000,
    lineTotal: 300000,
    stockAfter: 13,
    inventoryValueAfter: 300000,
  });
  assert.deepEqual(created.totals, { receiptQuantity: 3, receiptAmount: 300000 });
  assert.equal(created.receipt.receiptId, undefined);
  assert.equal(created.items[0].detailId, undefined);
  assert.equal(created.items[0].importPrice, undefined);
  assert.equal(created.totals.totalQuantity, undefined);
  assert.equal(created.totals.inventoryValueAfter, undefined);

  const updated = await service.updateStockReceiptDetail(1, { SoLuong: 5, DonGiaNhap: 120000 });
  assert.deepEqual(updated.items[0], {
    receiptDetailId: 1,
    partId: 10,
    quantity: 5,
    unitPrice: 120000,
    lineTotal: 600000,
    stockAfter: 16,
    inventoryValueAfter: 600000,
  });
  assert.deepEqual(updated.receipt, {
    id: 1,
    supplierId: 1,
    importedAt: new Date("2026-03-30"),
    totalAmount: 900000,
  });
  assert.deepEqual(updated.totals, { receiptQuantity: 5, receiptAmount: 600000 });

  const deleted = await service.deleteStockReceiptDetail(created.items[0].receiptDetailId);
  assert.deepEqual(deleted.items[0], {
    receiptDetailId: 2,
    partId: 10,
    quantity: 3,
    unitPrice: 100000,
    lineTotal: 300000,
    stockAfter: 13,
    inventoryValueAfter: 300000,
  });
  assert.deepEqual(deleted.receipt, {
    id: 1,
    supplierId: 1,
    importedAt: new Date("2026-03-30"),
    totalAmount: 600000,
  });
  assert.deepEqual(deleted.totals, { receiptQuantity: 3, receiptAmount: 300000 });
});

test("stock receipt detail delete rejects stock decrement below zero", async () => {
  const createStockReceiptDetailService = await loadCreateDetailService();
  const fixture = createDetailDb({
    parts: [{ MaVatTu: 10, SoLuongTon: 1 }],
    receipts: [{ MaPhieuNhap: 1, TongTien: 0 }],
    details: [{ MaCTPN: 1, MaPhieuNhap: 1, MaVatTu: 10, SoLuong: 2, DonGiaNhap: 100000, ThanhTien: 200000 }],
  });

  const stockReceiptDetailService = createStockReceiptDetailService({ db: fixture.db });

  await assert.rejects(
    () => stockReceiptDetailService.deleteStockReceiptDetail(1),
    /Số lượng tồn kho không đủ\./,
  );
});

test("stock receipt detail list returns Contract B items and pagination", async () => {
  const createStockReceiptDetailService = await loadCreateDetailService();
  const fixture = createDetailDb({
    parts: [{ MaVatTu: 10, SoLuongTon: 12 }],
    receipts: [{ MaPhieuNhap: 1, MaNCC: 1, NgayNhap: new Date("2026-03-30"), TongTien: 0 }],
    details: [
      { MaCTPN: 2, MaPhieuNhap: 1, MaVatTu: 10, SoLuong: 3, DonGiaNhap: 100000, ThanhTien: 300000 },
      { MaCTPN: 1, MaPhieuNhap: 1, MaVatTu: 10, SoLuong: 2, DonGiaNhap: 90000, ThanhTien: 180000 },
    ],
  });

  const service = createStockReceiptDetailService({ db: fixture.db });
  const result = await service.getStockReceiptDetailList({ page: 1, limit: 10 });

    assert.deepEqual(result.items[0], {
      partId: 10,
      partCode: 10,
      partName: null,
      unit: null,
      stockQty: 3,
      unitCost: 100000,
      inventoryValue: 300000,
      updatedAt: null,
    });
  assert.deepEqual(result.pagination, {
    page: 1,
    limit: 10,
    totalItems: 2,
    totalPages: 1,
  });
});
