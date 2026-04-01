import test from "node:test";
import assert from "node:assert/strict";

import prisma from "../src/db/prisma.js";
import stockReceiptService, {
  STOCK_RECEIPT_INCLUDE_SUPPLIER,
} from "../src/services/management/stockReceipt.service.js";

test("stockReceiptService getStockReceiptList include thong tin nha cung cap", async () => {
  const originalTransaction = prisma.$transaction;
  const originalCount = prisma.pHIEU_NHAP_KHO.count;
  const originalFindMany = prisma.pHIEU_NHAP_KHO.findMany;
  const calls = {
    count: null,
    findMany: null,
  };

  prisma.pHIEU_NHAP_KHO.count = async (args) => {
    calls.count = args;
    return 1;
  };
  prisma.pHIEU_NHAP_KHO.findMany = async (args) => {
    calls.findMany = args;
    return [
      {
        MaPhieuNhap: 24,
        MaNCC: 6,
        NgayNhap: new Date("2026-02-18"),
        TongTien: "55000000",
        NhaCungCap: {
          MaNCC: 6,
          TenNCC: "Cong ty A",
          DienThoai: "0900000000",
        },
      },
    ];
  };
  prisma.$transaction = async (operations) => Promise.all(operations);

  try {
    const result = await stockReceiptService.getStockReceiptList({});

    assert.deepEqual(calls.count, { where: {} });
    assert.deepEqual(calls.findMany.include, STOCK_RECEIPT_INCLUDE_SUPPLIER);
    assert.equal(result.stockReceipts[0].NhaCungCap.TenNCC, "Cong ty A");
  } finally {
    prisma.$transaction = originalTransaction;
    prisma.pHIEU_NHAP_KHO.count = originalCount;
    prisma.pHIEU_NHAP_KHO.findMany = originalFindMany;
  }
});

test("stockReceiptService getStockReceiptById include thong tin nha cung cap", async () => {
  const originalFindUnique = prisma.pHIEU_NHAP_KHO.findUnique;
  let receivedArgs = null;

  prisma.pHIEU_NHAP_KHO.findUnique = async (args) => {
    receivedArgs = args;
    return {
      MaPhieuNhap: 24,
      MaNCC: 6,
      NgayNhap: new Date("2026-02-18"),
      TongTien: "55000000",
      NhaCungCap: {
        MaNCC: 6,
        TenNCC: "Cong ty A",
        DienThoai: "0900000000",
      },
    };
  };

  try {
    const result = await stockReceiptService.getStockReceiptById(24);

    assert.deepEqual(receivedArgs.include, STOCK_RECEIPT_INCLUDE_SUPPLIER);
    assert.equal(result.NhaCungCap.MaNCC, 6);
    assert.equal(result.NhaCungCap.TenNCC, "Cong ty A");
  } finally {
    prisma.pHIEU_NHAP_KHO.findUnique = originalFindUnique;
  }
});
