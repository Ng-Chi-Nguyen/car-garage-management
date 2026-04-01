import test from "node:test";
import assert from "node:assert/strict";

const ensureTestDatabaseUrl = () => {
  process.env.DATABASE_URL ??= "mysql://tester:secret@127.0.0.1:3306/garage_test";
};

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
      $transaction: async (callback, options) => callback(tx, options),
    },
  };
};

test("stock receipt detail create update delete preserve quantity transitions and response shape", async () => {
  const createStockReceiptDetailService = await loadCreateDetailService();
  const fixture = createDetailDb({
    parts: [{ MaVatTu: 10, SoLuongTon: 10 }],
    receipts: [{ MaPhieuNhap: 1, TongTien: 0 }],
    details: [{ MaCTPN: 1, MaPhieuNhap: 1, MaVatTu: 10, SoLuong: 2, DonGiaNhap: 100000, ThanhTien: 200000 }],
  });

  const service = createStockReceiptDetailService({ db: fixture.db });

  const created = await service.createStockReceiptDetail({ MaPhieuNhap: 1, MaVatTu: 10, SoLuong: 3, DonGiaNhap: 100000 });
  assert.deepEqual(Object.keys(created).sort(), ["DonGiaNhap", "MaCTPN", "MaPhieuNhap", "MaVatTu", "SoLuong", "ThanhTien", "inventoryValueAfter", "stockAfter"]);
  assert.equal(created.SoLuong, 3);
  assert.equal(created.stockAfter, 13);
  assert.equal(created.inventoryValueAfter, 300000);

  const updated = await service.updateStockReceiptDetail(1, { SoLuong: 5, DonGiaNhap: 120000 });
  assert.equal(updated.SoLuong, 5);
  assert.equal(updated.stockAfter, 16);
  assert.equal(updated.inventoryValueAfter, 600000);

  const deleted = await service.deleteStockReceiptDetail(created.MaCTPN);
  assert.equal(deleted.MaCTPN, created.MaCTPN);
  assert.equal(deleted.stockAfter, 13);
  assert.equal(deleted.inventoryValueAfter, 300000);
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
