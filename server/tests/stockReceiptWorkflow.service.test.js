import test from "node:test";
import assert from "node:assert/strict";

import { createStockReceiptWorkflowService } from "../src/services/workflows/stockReceiptWorkflow.service.js";

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

test("stock receipt workflow returns valuation in mutation response", async () => {
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

  assert.ok(Object.hasOwn(result, "inventoryValueAfter"));
});
