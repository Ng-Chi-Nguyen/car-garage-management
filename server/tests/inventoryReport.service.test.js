import test from "node:test";
import assert from "node:assert/strict";

const ensureTestDatabaseUrl = () => {
  process.env.DATABASE_URL ??= "mysql://tester:secret@127.0.0.1:3306/garage_test";
};

const loadInventoryReportModule = async () => {
  ensureTestDatabaseUrl();
  return await import("../src/services/report/inventoryReport.service.js");
};

const createDecimalLike = (value) => ({
  toString: () => String(value),
});

const createDbStub = ({
  partFindManyImpl = async () => [],
  importFindManyImpl = async () => [],
  usageFindManyImpl = async () => [],
} = {}) => ({
  vAT_TU: {
    findMany: partFindManyImpl,
  },
  cT_PHIEU_NHAP: {
    findMany: importFindManyImpl,
  },
  cT_PHIEU_SUA_CHUA: {
    findMany: usageFindManyImpl,
  },
});

test("service getInventorySummary tinh ton kho, top usage, ton hien tai va nha cung cap nhap nhieu nhat", async () => {
  const { createInventoryReportService, LOW_STOCK_THRESHOLD } = await loadInventoryReportModule();
  let importArgs;
  let usageArgs;
  const db = createDbStub({
    partFindManyImpl: async () => [
      {
        MaVatTu: 1,
        TenVatTu: "Loc dau",
        DonViTinh: "cai",
        SoLuongTon: 5,
        GiaVon: createDecimalLike(100000),
        MaNCC: 1,
        NhaCungCap: { TenNCC: "NCC A" },
      },
      {
        MaVatTu: 2,
        TenVatTu: "Bugi",
        DonViTinh: "cai",
        SoLuongTon: 1,
        GiaVon: createDecimalLike(200000),
        MaNCC: 2,
        NhaCungCap: { TenNCC: "NCC B" },
      },
    ],
    importFindManyImpl: async (args) => {
      importArgs = args;
      return [
        {
          MaVatTu: 1,
          SoLuong: 10,
          ThanhTien: createDecimalLike(1000000),
          PhieuNhapKho: {
            NgayNhap: new Date("2026-03-05T00:00:00.000Z"),
            MaNCC: 1,
            NhaCungCap: { TenNCC: "NCC A" },
          },
        },
        {
          MaVatTu: 2,
          SoLuong: 4,
          ThanhTien: createDecimalLike(800000),
          PhieuNhapKho: {
            NgayNhap: new Date("2026-03-10T00:00:00.000Z"),
            MaNCC: 2,
            NhaCungCap: { TenNCC: "NCC B" },
          },
        },
        {
          MaVatTu: 1,
          SoLuong: 2,
          ThanhTien: createDecimalLike(200000),
          PhieuNhapKho: {
            NgayNhap: new Date("2026-02-25T00:00:00.000Z"),
            MaNCC: 1,
            NhaCungCap: { TenNCC: "NCC A" },
          },
        },
      ];
    },
    usageFindManyImpl: async (args) => {
      usageArgs = args;
      return [
        {
          MaVatTu: 1,
          SoLuong: 6,
          PhieuSuaChua: {
            NgaySC: new Date("2026-03-15T00:00:00.000Z"),
          },
        },
        {
          MaVatTu: 2,
          SoLuong: 1,
          PhieuSuaChua: {
            NgaySC: new Date("2026-03-20T00:00:00.000Z"),
          },
        },
        {
          MaVatTu: 1,
          SoLuong: 1,
          PhieuSuaChua: {
            NgaySC: new Date("2026-02-20T00:00:00.000Z"),
          },
        },
      ];
    },
  });

  const service = createInventoryReportService({ db });
  const result = await service.getInventorySummary({
    from: "2026-03-01",
    to: "2026-03-31",
  });

  assert.equal(importArgs.where.PhieuNhapKho.NgayNhap.lt.toISOString(), "2026-03-31T17:00:00.000Z");
  assert.equal(usageArgs.where.PhieuSuaChua.NgaySC.lt.toISOString(), "2026-03-31T17:00:00.000Z");
  assert.deepEqual(result, {
    range: {
      from: "2026-03-01",
      to: "2026-03-31",
    },
    stockMovement: {
      totals: {
        openingQuantity: 1,
        importedQuantity: 14,
        exportedQuantity: 7,
        closingQuantity: 8,
      },
      items: [
        {
          partId: 1,
          partName: "Loc dau",
          unit: "cai",
          openingQuantity: 1,
          importedQuantity: 10,
          exportedQuantity: 6,
          closingQuantity: 5,
        },
        {
          partId: 2,
          partName: "Bugi",
          unit: "cai",
          openingQuantity: 0,
          importedQuantity: 4,
          exportedQuantity: 1,
          closingQuantity: 3,
        },
      ],
    },
    mostUsedParts: [
      {
        partId: 1,
        partName: "Loc dau",
        unit: "cai",
        quantityUsed: 6,
        currentStock: 5,
      },
      {
        partId: 2,
        partName: "Bugi",
        unit: "cai",
        quantityUsed: 1,
        currentStock: 1,
      },
    ],
    lowStockParts: [
      {
        partId: 2,
        partName: "Bugi",
        unit: "cai",
        currentStock: 1,
        threshold: LOW_STOCK_THRESHOLD,
      },
      {
        partId: 1,
        partName: "Loc dau",
        unit: "cai",
        currentStock: 5,
        threshold: LOW_STOCK_THRESHOLD,
      },
    ],
    currentInventoryValue: {
      totalValue: 700000,
      totalQuantity: 6,
      partCount: 2,
    },
    topSupplier: {
      supplierId: 1,
      supplierName: "NCC A",
      importedQuantity: 10,
      importedValue: 1000000,
    },
  });
});

test("service getInventorySummary tra topSupplier null va van liet ke du phu tung khong xuat", async () => {
  const { createInventoryReportService } = await loadInventoryReportModule();
  const db = createDbStub({
    partFindManyImpl: async () => [
      {
        MaVatTu: 3,
        TenVatTu: "Den pha",
        DonViTinh: "cai",
        SoLuongTon: 9,
        GiaVon: createDecimalLike(500000),
        MaNCC: null,
        NhaCungCap: null,
      },
    ],
  });

  const service = createInventoryReportService({ db });
  const result = await service.getInventorySummary({
    from: "2026-03-01",
    to: "2026-03-31",
  });

  assert.deepEqual(result.mostUsedParts, [
    {
      partId: 3,
      partName: "Den pha",
      unit: "cai",
      quantityUsed: 0,
      currentStock: 9,
    },
  ]);
  assert.equal(result.topSupplier, null);
  assert.deepEqual(result.currentInventoryValue, {
    totalValue: 4500000,
    totalQuantity: 9,
    partCount: 1,
  });
});
