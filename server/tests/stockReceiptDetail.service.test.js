import test from "node:test";
import assert from "node:assert/strict";

import prisma from "../src/db/prisma.js";
import stockReceiptDetailService, {
  STOCK_RECEIPT_DETAIL_INCLUDE_RELATIONS,
} from "../src/services/management/stockReceiptDetail.service.js";

test("stockReceiptDetailService getStockReceiptDetailList include phieu nhap kho va vat tu", async () => {
  const originalTransaction = prisma.$transaction;
  const originalCount = prisma.cT_PHIEU_NHAP.count;
  const originalFindMany = prisma.cT_PHIEU_NHAP.findMany;
  const calls = {
    count: null,
    findMany: null,
  };

  prisma.cT_PHIEU_NHAP.count = async (args) => {
    calls.count = args;
    return 1;
  };
  prisma.cT_PHIEU_NHAP.findMany = async (args) => {
    calls.findMany = args;
    return [
      {
        MaCTPN: 72,
        MaPhieuNhap: 24,
        MaVatTu: 12,
        SoLuong: 110,
        DonGiaNhap: "50000",
        ThanhTien: "5500000",
        PhieuNhapKho: {
          MaPhieuNhap: 24,
          MaNCC: 6,
          NgayNhap: new Date("2026-04-01"),
        },
        VatTu: {
          MaVatTu: 12,
          TenVatTu: "Cau chi va bong den phu",
          DonViTinh: "Bo",
        },
      },
    ];
  };
  prisma.$transaction = async (operations) => Promise.all(operations);

  try {
    const result = await stockReceiptDetailService.getStockReceiptDetailList({});

    assert.deepEqual(calls.count, { where: {} });
    assert.deepEqual(calls.findMany.include, STOCK_RECEIPT_DETAIL_INCLUDE_RELATIONS);
    assert.equal(result.stockReceiptDetails[0].PhieuNhapKho.MaPhieuNhap, 24);
    assert.equal(result.stockReceiptDetails[0].VatTu.TenVatTu, "Cau chi va bong den phu");
  } finally {
    prisma.$transaction = originalTransaction;
    prisma.cT_PHIEU_NHAP.count = originalCount;
    prisma.cT_PHIEU_NHAP.findMany = originalFindMany;
  }
});

test("stockReceiptDetailService getStockReceiptDetailById include phieu nhap kho va vat tu", async () => {
  const originalFindUnique = prisma.cT_PHIEU_NHAP.findUnique;
  let receivedArgs = null;

  prisma.cT_PHIEU_NHAP.findUnique = async (args) => {
    receivedArgs = args;
    return {
      MaCTPN: 72,
      MaPhieuNhap: 24,
      MaVatTu: 12,
      PhieuNhapKho: {
        MaPhieuNhap: 24,
        MaNCC: 6,
        NgayNhap: new Date("2026-04-01"),
      },
      VatTu: {
        MaVatTu: 12,
        TenVatTu: "Cau chi va bong den phu",
        DonViTinh: "Bo",
      },
    };
  };

  try {
    const result = await stockReceiptDetailService.getStockReceiptDetailById(72);

    assert.deepEqual(receivedArgs.include, STOCK_RECEIPT_DETAIL_INCLUDE_RELATIONS);
    assert.equal(result.PhieuNhapKho.MaPhieuNhap, 24);
    assert.equal(result.VatTu.MaVatTu, 12);
  } finally {
    prisma.cT_PHIEU_NHAP.findUnique = originalFindUnique;
  }
});
