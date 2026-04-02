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
  return {
    createStockReceiptService: serviceModule.createStockReceiptService,
    stockReceiptService: serviceModule.default,
    STOCK_RECEIPT_INCLUDE_SUPPLIER: serviceModule.STOCK_RECEIPT_INCLUDE_SUPPLIER,
    prisma: prismaModule.default,
  };
};

const createReceiptDb = (receipts) => ({
  pHIEU_NHAP_KHO: {
    count: async () => receipts.length,
    findMany: async () => receipts,
  },
  $transaction: async (operations) => Promise.all(operations),
});

test("stock receipt list returns Contract B items and pagination", async () => {
  const receipts = [
    { MaPhieuNhap: 2, MaNCC: 5, TongTien: 450000, NgayNhap: new Date("2026-03-31") },
    { MaPhieuNhap: 1, MaNCC: 7, TongTien: 200000, NgayNhap: new Date("2026-03-30") },
  ];

  const { createStockReceiptService } = await loadModules();
  const stockReceiptService = createStockReceiptService({ db: createReceiptDb(receipts) });
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
});

test("stock receipt list query includes supplier relation", async () => {
  const { stockReceiptService, STOCK_RECEIPT_INCLUDE_SUPPLIER, prisma } = await loadModules();
  const originalTransaction = prisma.$transaction;
  const originalDelegate = prisma.pHIEU_NHAP_KHO;
  const calls = {
    count: null,
    findMany: null,
  };

  prisma.$transaction = async (operations) => Promise.all(operations);
  prisma.pHIEU_NHAP_KHO = {
    count: async (args) => {
      calls.count = args;
      return 1;
    },
    findMany: async (args) => {
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
    },
  };

  try {
    const result = await stockReceiptService.getStockReceiptList({});

    assert.deepEqual(calls.count, { where: {} });
    assert.deepEqual(calls.findMany.include, STOCK_RECEIPT_INCLUDE_SUPPLIER);
    assert.equal(result.items.length, 1);
  } finally {
    prisma.$transaction = originalTransaction;
    prisma.pHIEU_NHAP_KHO = originalDelegate;
  }
});

test("stock receipt by id query includes supplier relation", async () => {
  const { stockReceiptService, STOCK_RECEIPT_INCLUDE_SUPPLIER, prisma } = await loadModules();
  const originalDelegate = prisma.pHIEU_NHAP_KHO;
  let findUniqueArgs = null;

  prisma.pHIEU_NHAP_KHO = {
    ...originalDelegate,
    findUnique: async (args) => {
      findUniqueArgs = args;
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
    },
  };

  try {
    const result = await stockReceiptService.getStockReceiptById(24);

    assert.deepEqual(findUniqueArgs.include, STOCK_RECEIPT_INCLUDE_SUPPLIER);
    assert.equal(result.NhaCungCap.MaNCC, 6);
  } finally {
    prisma.pHIEU_NHAP_KHO = originalDelegate;
  }
});

test("update stock receipt returns normalized receipt contract", async () => {
  const receipts = [{ MaPhieuNhap: 1, MaNCC: 5, TongTien: 450000, NgayNhap: new Date("2026-03-31") }];

  const { createStockReceiptService } = await loadModules();
  const stockReceiptService = createStockReceiptService({
    db: {
      pHIEU_NHAP_KHO: {
        findUnique: async () => receipts[0],
        update: async ({ data }) => ({ ...receipts[0], ...data }),
      },
    },
  });

  const result = await stockReceiptService.updateStockReceipt(1, { MaNCC: 8, NgayNhap: new Date("2026-04-01") });

  assert.deepEqual(result, {
    id: 1,
    supplierId: 8,
    importedAt: new Date("2026-04-01"),
    totalAmount: 450000,
  });
  assert.equal(result.receiptId, undefined);
  assert.equal(result.receivedAt, undefined);
  assert.equal(result.totalQuantity, undefined);
});
