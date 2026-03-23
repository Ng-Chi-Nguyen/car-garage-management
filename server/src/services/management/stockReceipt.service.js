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
      stockReceipts,
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
