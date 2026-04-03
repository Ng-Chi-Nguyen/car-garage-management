import {
  buildListWhere,
  buildPagination,
  buildServiceError,
  buildWriteData,
} from "../../shared/crud/crud.helpers.js";

const STOCK_RECEIPT_FILTER_FIELDS = {
  MaPhieuNhap: { type: "number", positive: true },
  MaNCC: { type: "number", positive: true },
  NgayNhapFrom: { type: "dateFrom", targetField: "NgayNhap" },
  NgayNhapTo: { type: "dateTo", targetField: "NgayNhap" },
  TongTien: { type: "decimal", min: 0 },
};

const WRITE_FIELDS = ["MaNCC", "NgayNhap"];

export const STOCK_RECEIPT_INCLUDE_SUPPLIER = {
  NhaCungCap: {
    select: {
      MaNCC: true,
      TenNCC: true,
      DienThoai: true,
    },
  },
};

const resolvePrisma = async (db) => db ?? (await import("../../db/prisma.js")).default;

const normalizeListItem = (stockReceipt) => ({
  partId: Number(stockReceipt.MaVatTu ?? stockReceipt.partId ?? stockReceipt.MaPhieuNhap ?? 0),
  partCode: stockReceipt.MaVatTu ?? stockReceipt.partCode ?? stockReceipt.MaPhieuNhap ?? null,
  partName: stockReceipt.TenVatTu ?? stockReceipt.partName ?? stockReceipt.TenPhieuNhap ?? null,
  unit: stockReceipt.DonViTinh ?? stockReceipt.unit ?? null,
  stockQty: Number(stockReceipt.SoLuongTon ?? stockReceipt.stockQty ?? 0),
  unitCost: Number(stockReceipt.DonGiaNhap ?? stockReceipt.unitCost ?? 0),
  inventoryValue: Number(stockReceipt.ThanhTien ?? stockReceipt.TongTien ?? stockReceipt.inventoryValue ?? 0),
  updatedAt: stockReceipt.updatedAt ?? stockReceipt.NgayNhap ?? null,
});

const normalizeReceipt = (stockReceipt) => ({
  id: Number(stockReceipt.MaPhieuNhap),
  supplierId: Number(stockReceipt.MaNCC),
  importedAt: stockReceipt.NgayNhap,
  totalAmount: Number(stockReceipt.TongTien ?? 0),
});

const getStockReceiptByIdInternal = async (db, id) => {
  const stockReceipt = await db.pHIEU_NHAP_KHO.findUnique({
    where: {
      MaPhieuNhap: Number(id),
    },
    include: STOCK_RECEIPT_INCLUDE_SUPPLIER,
  });

  if (!stockReceipt) {
    throw buildServiceError(404, "Không tìm thấy phiếu nhập kho.");
  }

  return stockReceipt;
};

const createStockReceiptService = ({ db } = {}) => {
  const resolveClient = async () => resolvePrisma(db);

  return {
    createStockReceipt: async (payload) => {
      const prisma = await resolveClient();
      return prisma.pHIEU_NHAP_KHO.create({
        data: {
          ...buildWriteData(payload, WRITE_FIELDS),
          TongTien: 0,
        },
      }).then(normalizeReceipt);
    },
    getStockReceiptList: async ({ page = 1, limit = 10, search = "", ...filters } = {}) => {
      const prisma = await resolveClient();
      const pagination = buildPagination({ page, limit });
      const where = buildListWhere({
        search,
        filters,
        filterFields: STOCK_RECEIPT_FILTER_FIELDS,
      });

      const [totalItems, stockReceipts] = await prisma.$transaction([
        prisma.pHIEU_NHAP_KHO.count({ where }),
        prisma.pHIEU_NHAP_KHO.findMany({
          where,
          skip: pagination.skip,
          take: pagination.limit,
          include: STOCK_RECEIPT_INCLUDE_SUPPLIER,
          orderBy: [
            { MaPhieuNhap: "desc" },
            { NgayNhap: "desc" },
          ],
        }),
      ]);

      return {
        items: stockReceipts.map(normalizeListItem),
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          totalItems,
          totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pagination.limit),
        },
      };
    },
    getStockReceiptById: async (id) => normalizeReceipt(await getStockReceiptByIdInternal(await resolveClient(), id)),
    updateStockReceipt: async (id, payload) => {
      const prisma = await resolveClient();
      await getStockReceiptByIdInternal(prisma, id);

      return prisma.pHIEU_NHAP_KHO.update({
        where: {
          MaPhieuNhap: Number(id),
        },
        data: buildWriteData(payload, WRITE_FIELDS),
      }).then(normalizeReceipt);
    },
    deleteStockReceipt: async (id) => {
      const prisma = await resolveClient();
      const existingStockReceipt = await getStockReceiptByIdInternal(prisma, id);

      const relatedStockReceiptDetailsCount = await prisma.cT_PHIEU_NHAP.count({
        where: {
          MaPhieuNhap: Number(id),
        },
      });

      if (relatedStockReceiptDetailsCount > 0) {
        throw buildServiceError(409, "Không thể xóa phiếu nhập kho vì đang có dữ liệu chi tiết liên quan.");
      }

      await prisma.pHIEU_NHAP_KHO.delete({
        where: {
          MaPhieuNhap: Number(id),
        },
      });

      return normalizeReceipt(existingStockReceipt);
    },
  };
};

const stockReceiptService = createStockReceiptService();

export { createStockReceiptService };
export default stockReceiptService;
