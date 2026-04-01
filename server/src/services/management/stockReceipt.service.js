import prisma from "../../db/prisma.js";
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

const getStockReceiptByIdInternal = async (db, id) => {
  const stockReceipt = await db.pHIEU_NHAP_KHO.findUnique({
    where: {
      MaPhieuNhap: Number(id),
    },
  });

  if (!stockReceipt) {
    throw buildServiceError(404, "Không tìm thấy phiếu nhập kho.");
  }

  return stockReceipt;
};

const stockReceiptService = {
  createStockReceipt: async (payload) => {
    return prisma.pHIEU_NHAP_KHO.create({
      data: {
        ...buildWriteData(payload, WRITE_FIELDS),
        TongTien: 0,
      },
    });
  },
  getStockReceiptList: async ({ page = 1, limit = 10, search = "", ...filters } = {}) => {
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
        orderBy: {
          MaPhieuNhap: "desc",
        },
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
  getStockReceiptById: async (id) => getStockReceiptByIdInternal(prisma, id),
  updateStockReceipt: async (id, payload) => {
    await getStockReceiptByIdInternal(prisma, id);

    return prisma.pHIEU_NHAP_KHO.update({
      where: {
        MaPhieuNhap: Number(id),
      },
      data: buildWriteData(payload, WRITE_FIELDS),
    });
  },
  deleteStockReceipt: async (id) => {
    await getStockReceiptByIdInternal(prisma, id);

    return prisma.pHIEU_NHAP_KHO.delete({
      where: {
        MaPhieuNhap: Number(id),
      },
    });
  },
};

export default stockReceiptService;
