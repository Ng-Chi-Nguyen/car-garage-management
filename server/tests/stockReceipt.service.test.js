import test from "node:test";
import assert from "node:assert/strict";

const ensureTestDatabaseUrl = () => {
  process.env.DATABASE_URL ??= "mysql://tester:secret@127.0.0.1:3306/garage_test";
};

ensureTestDatabaseUrl();

const loadModules = async () => {
  ensureTestDatabaseUrl();
  const [serviceModule, prismaModule] = await Promise.all([
    import("../src/services/management/stockReceipt.service.js"),
    import("../src/db/prisma.js"),
  ]);
  return { stockReceiptService: serviceModule.default, prisma: prismaModule.default };
};

test("stock receipt list returns Contract B items and pagination", async () => {
  const { stockReceiptService, prisma } = await loadModules();
  const originalTransaction = prisma.$transaction;
  const originalDelegate = prisma.pHIEU_NHAP_KHO;

  const receipts = [
    { MaPhieuNhap: 2, MaNCC: 5, TongTien: 450000, NgayNhap: new Date("2026-03-31") },
    { MaPhieuNhap: 1, MaNCC: 7, TongTien: 200000, NgayNhap: new Date("2026-03-30") },
  ];

  prisma.$transaction = async (operations) => Promise.all(operations);
  prisma.pHIEU_NHAP_KHO = {
    count: async () => receipts.length,
    findMany: async () => receipts,
  };

  try {
    const result = await stockReceiptService.getStockReceiptList({ page: 1, limit: 10 });

    assert.deepEqual(result.items[0], {
      partId: 2,
      partCode: 2,
      partName: null,
      unit: null,
      stockQty: 0,
      unitCost: 0,
      inventoryValue: 450000,
      updatedAt: new Date("2026-03-31"),
    });
    assert.deepEqual(result.pagination, {
      page: 1,
      limit: 10,
      totalItems: 2,
      totalPages: 1,
    });
  } finally {
    prisma.$transaction = originalTransaction;
    prisma.pHIEU_NHAP_KHO = originalDelegate;
  }
});
