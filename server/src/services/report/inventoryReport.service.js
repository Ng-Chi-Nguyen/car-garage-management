import prisma from "../../db/prisma.js";
import { buildRangeFromQuery } from "./reportDateRange.helpers.js";

const LOW_STOCK_THRESHOLD = 5;

const normalizeNumber = (value) => {
  if (value === null || value === undefined) {
    return 0;
  }

  const rawValue = typeof value === "number" ? value : value?.toString?.() ?? value;
  const numericValue = Number(rawValue);

  if (!Number.isFinite(numericValue)) {
    throw new Error(`Invalid numeric value: ${String(rawValue)}`);
  }

  return numericValue;
};

const createPartSummaryMap = (parts) => {
  const map = new Map();

  parts.forEach((part) => {
    map.set(part.MaVatTu, {
      partId: part.MaVatTu,
      partName: part.TenVatTu,
      unit: part.DonViTinh,
      currentStock: normalizeNumber(part.SoLuongTon),
      costPrice: normalizeNumber(part.GiaVon),
      supplierId: part.MaNCC ?? null,
      supplierName: part.NhaCungCap?.TenNCC ?? null,
      openingQuantity: 0,
      importedQuantity: 0,
      exportedQuantity: 0,
      closingQuantity: 0,
      quantityUsed: 0,
    });
  });

  return map;
};

const applyImportRowsToSummary = (summaryMap, importRows, range) => {
  const importedBySupplier = new Map();

  importRows.forEach((row) => {
    const partSummary = summaryMap.get(row.MaVatTu);
    if (!partSummary) {
      return;
    }

    const quantity = normalizeNumber(row.SoLuong);
    const receiptDate = row.PhieuNhapKho?.NgayNhap;
    if (!(receiptDate instanceof Date) || Number.isNaN(receiptDate.getTime())) {
      return;
    }

    if (receiptDate < range.start) {
      partSummary.openingQuantity += quantity;
    }

    partSummary.closingQuantity += quantity;

    if (receiptDate >= range.start && receiptDate < range.endExclusive) {
      const amount = normalizeNumber(row.ThanhTien);
      partSummary.importedQuantity += quantity;

      const supplierId = row.PhieuNhapKho?.MaNCC ?? null;
      const supplierName = row.PhieuNhapKho?.NhaCungCap?.TenNCC ?? null;

      if (supplierId !== null && supplierName) {
        const current = importedBySupplier.get(supplierId) ?? {
          supplierId,
          supplierName,
          importedQuantity: 0,
          importedValue: 0,
        };

        current.importedQuantity += quantity;
        current.importedValue += amount;
        importedBySupplier.set(supplierId, current);
      }
    }
  });

  return importedBySupplier;
};

const applyUsageRowsToSummary = (summaryMap, usageRows, range) => {
  usageRows.forEach((row) => {
    const partSummary = summaryMap.get(row.MaVatTu);
    if (!partSummary) {
      return;
    }

    const quantity = normalizeNumber(row.SoLuong);
    const repairDate = row.PhieuSuaChua?.NgaySC;
    if (!(repairDate instanceof Date) || Number.isNaN(repairDate.getTime())) {
      return;
    }

    if (repairDate < range.start) {
      partSummary.openingQuantity -= quantity;
    }

    partSummary.closingQuantity -= quantity;

    if (repairDate >= range.start && repairDate < range.endExclusive) {
      partSummary.exportedQuantity += quantity;
      partSummary.quantityUsed += quantity;
    }
  });
};

const buildStockMovement = (summaryMap) => {
  const items = Array.from(summaryMap.values())
    .map((item) => ({
      partId: item.partId,
      partName: item.partName,
      unit: item.unit,
      openingQuantity: item.openingQuantity,
      importedQuantity: item.importedQuantity,
      exportedQuantity: item.exportedQuantity,
      closingQuantity: item.closingQuantity,
    }))
    .sort((left, right) => left.partId - right.partId);

  return {
    totals: {
      openingQuantity: items.reduce((sum, item) => sum + item.openingQuantity, 0),
      importedQuantity: items.reduce((sum, item) => sum + item.importedQuantity, 0),
      exportedQuantity: items.reduce((sum, item) => sum + item.exportedQuantity, 0),
      closingQuantity: items.reduce((sum, item) => sum + item.closingQuantity, 0),
    },
    items,
  };
};

const buildMostUsedParts = (summaryMap) =>
  Array.from(summaryMap.values())
    .map((item) => ({
      partId: item.partId,
      partName: item.partName,
      unit: item.unit,
      quantityUsed: item.quantityUsed,
      currentStock: item.currentStock,
    }))
    .sort((left, right) => {
      if (right.quantityUsed !== left.quantityUsed) {
        return right.quantityUsed - left.quantityUsed;
      }

      return left.partId - right.partId;
    });

const buildLowStockParts = (summaryMap) =>
  Array.from(summaryMap.values())
    .filter((item) => item.currentStock <= LOW_STOCK_THRESHOLD)
    .map((item) => ({
      partId: item.partId,
      partName: item.partName,
      unit: item.unit,
      currentStock: item.currentStock,
      threshold: LOW_STOCK_THRESHOLD,
    }))
    .sort((left, right) => {
      if (left.currentStock !== right.currentStock) {
        return left.currentStock - right.currentStock;
      }

      return left.partId - right.partId;
    });

const buildCurrentInventoryValue = (summaryMap) => {
  const items = Array.from(summaryMap.values());

  return {
    totalValue: items.reduce((sum, item) => sum + item.currentStock * item.costPrice, 0),
    totalQuantity: items.reduce((sum, item) => sum + item.currentStock, 0),
    partCount: items.length,
  };
};

const buildTopSupplier = (importedBySupplier) => {
  if (!importedBySupplier.size) {
    return null;
  }

  return Array.from(importedBySupplier.values()).sort((left, right) => {
    if (right.importedQuantity !== left.importedQuantity) {
      return right.importedQuantity - left.importedQuantity;
    }

    if (right.importedValue !== left.importedValue) {
      return right.importedValue - left.importedValue;
    }

    return left.supplierId - right.supplierId;
  })[0];
};

const createInventoryReportService = ({
  db = prisma,
} = {}) => {
  return {
    getInventorySummary: async ({ from, to }) => {
      const range = buildRangeFromQuery({ from, to });
      const [parts, importRows, usageRows] = await Promise.all([
        db.vAT_TU.findMany({
          select: {
            MaVatTu: true,
            TenVatTu: true,
            DonViTinh: true,
            SoLuongTon: true,
            GiaVon: true,
            MaNCC: true,
            NhaCungCap: {
              select: {
                TenNCC: true,
              },
            },
          },
          orderBy: {
            MaVatTu: "asc",
          },
        }),
        db.cT_PHIEU_NHAP.findMany({
          where: {
            PhieuNhapKho: {
              NgayNhap: {
                lt: range.endExclusive,
              },
            },
          },
          select: {
            MaVatTu: true,
            SoLuong: true,
            ThanhTien: true,
            PhieuNhapKho: {
              select: {
                NgayNhap: true,
                MaNCC: true,
                NhaCungCap: {
                  select: {
                    TenNCC: true,
                  },
                },
              },
            },
          },
        }),
        db.cT_PHIEU_SUA_CHUA.findMany({
          where: {
            PhieuSuaChua: {
              NgaySC: {
                lt: range.endExclusive,
              },
            },
          },
          select: {
            MaVatTu: true,
            SoLuong: true,
            PhieuSuaChua: {
              select: {
                NgaySC: true,
              },
            },
          },
        }),
      ]);

      const summaryMap = createPartSummaryMap(parts);
      const importedBySupplier = applyImportRowsToSummary(summaryMap, importRows, range);
      applyUsageRowsToSummary(summaryMap, usageRows, range);

      return {
        range: {
          from,
          to,
        },
        stockMovement: buildStockMovement(summaryMap),
        mostUsedParts: buildMostUsedParts(summaryMap),
        lowStockParts: buildLowStockParts(summaryMap),
        currentInventoryValue: buildCurrentInventoryValue(summaryMap),
        topSupplier: buildTopSupplier(importedBySupplier),
      };
    },
  };
};

const inventoryReportService = createInventoryReportService();

export { LOW_STOCK_THRESHOLD, createInventoryReportService };
export default inventoryReportService;
