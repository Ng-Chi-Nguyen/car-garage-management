import test from "node:test";
import assert from "node:assert/strict";
import { createStockReceiptDetailService } from "../src/services/management/stockReceiptDetail.service.js";

const cloneValue = (value) => structuredClone(value);

const createDetailDb = (initialState) => {
  const state = cloneValue(initialState);
  const tx = {
    cT_PHIEU_NHAP: {
      create: async ({ data }) => {
        const record = { MaCTPN: 1, ...cloneValue(data) };
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
      findUnique: async ({ where }) => cloneValue(state.parts.find((item) => item.MaVatTu === Number(where.MaVatTu)) ?? null),
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

test("stock receipt detail delete rejects stock decrement below zero", async () => {
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
