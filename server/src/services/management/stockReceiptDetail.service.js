import { Prisma } from "@prisma/client";

import prisma from "../../db/prisma.js";
import {
  buildListWhere,
  buildPagination,
  buildServiceError,
  buildWriteData,
} from "../../shared/crud/crud.helpers.js";
import {
  adjustPartStock,
  calculateImportLineTotal,
  calculateImportStockAdjustment,
  syncStockReceiptTotal,
} from "../../shared/crud/crudBusiness.helpers.js";

const STOCK_RECEIPT_DETAIL_FILTER_FIELDS = {
  MaCTPN: { type: "number", positive: true },
  MaPhieuNhap: { type: "number", positive: true },
  MaVatTu: { type: "number", positive: true },
  SoLuong: { type: "number", positive: true },
  DonGiaNhap: { type: "decimal", min: 0 },
  ThanhTien: { type: "decimal", min: 0 },
};

const WRITE_FIELDS = ["MaPhieuNhap", "MaVatTu", "SoLuong", "DonGiaNhap"];
const TRANSACTION_OPTIONS = {
  isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
};

export const STOCK_RECEIPT_DETAIL_INCLUDE_RELATIONS = {
  PhieuNhapKho: {
    select: {
      MaPhieuNhap: true,
      MaNCC: true,
      NgayNhap: true,
    },
  },
  VatTu: {
    select: {
      MaVatTu: true,
      TenVatTu: true,
      DonViTinh: true,
    },
  },
};

const getStockReceiptDetailByIdInternal = async (db, id) => {
  const stockReceiptDetail = await db.cT_PHIEU_NHAP.findUnique({
    where: {
      MaCTPN: Number(id),
    },
    include: STOCK_RECEIPT_DETAIL_INCLUDE_RELATIONS,
  });

  if (!stockReceiptDetail) {
    throw buildServiceError(404, "Không tìm thấy chi tiết phiếu nhập.");
  }

  return stockReceiptDetail;
};

const normalizeReceipt = (stockReceiptDetail) => ({
  id: Number(stockReceiptDetail.MaPhieuNhap),
  supplierId: stockReceiptDetail.supplierId,
  importedAt: stockReceiptDetail.importedAt,
  totalAmount: Number(stockReceiptDetail.receiptTotalAmount ?? stockReceiptDetail.TongTien ?? 0),
});

const normalizeReceiptItem = (stockReceiptDetail, stockAfter) => ({
  receiptDetailId: Number(stockReceiptDetail.MaCTPN),
  partId: Number(stockReceiptDetail.MaVatTu),
  quantity: Number(stockReceiptDetail.SoLuong),
  unitPrice: Number(stockReceiptDetail.DonGiaNhap),
  lineTotal: Number(stockReceiptDetail.ThanhTien ?? 0),
  stockAfter: Number(stockAfter ?? 0),
  inventoryValueAfter: Number(stockReceiptDetail.ThanhTien ?? 0),
});

const normalizeListItem = (stockReceiptDetail) => ({
  partId: Number(stockReceiptDetail.MaVatTu ?? stockReceiptDetail.partId ?? 0),
  partCode: stockReceiptDetail.MaVatTu ?? stockReceiptDetail.partCode ?? null,
  partName: stockReceiptDetail.TenVatTu ?? stockReceiptDetail.partName ?? null,
  unit: stockReceiptDetail.DonViTinh ?? stockReceiptDetail.unit ?? null,
  stockQty: Number(stockReceiptDetail.SoLuong ?? stockReceiptDetail.stockQty ?? 0),
  unitCost: Number(stockReceiptDetail.DonGiaNhap ?? stockReceiptDetail.unitCost ?? 0),
  inventoryValue: Number(stockReceiptDetail.ThanhTien ?? stockReceiptDetail.inventoryValue ?? 0),
  updatedAt: stockReceiptDetail.updatedAt ?? stockReceiptDetail.NgayNhap ?? null,
});

const createStockReceiptDetailService = ({ db = prisma } = {}) => {
  const buildMutationResponse = async (tx, stockReceiptDetail) => {
    const part = await tx.vAT_TU.findUnique({
      where: {
        MaVatTu: Number(stockReceiptDetail.MaVatTu),
      },
      select: {
        SoLuongTon: true,
      },
    });

    const stockReceipt = await tx.pHIEU_NHAP_KHO.findUnique({
      where: {
        MaPhieuNhap: Number(stockReceiptDetail.MaPhieuNhap),
      },
      select: {
        MaNCC: true,
        NgayNhap: true,
        TongTien: true,
      },
    });

    return {
      receipt: normalizeReceipt({
        ...stockReceiptDetail,
        supplierId: stockReceipt?.MaNCC,
        importedAt: stockReceipt?.NgayNhap,
        TongTien: stockReceipt?.TongTien,
      }),
      items: [normalizeReceiptItem(stockReceiptDetail, part?.SoLuongTon)],
      totals: {
        receiptQuantity: Number(stockReceiptDetail.SoLuong ?? 0),
        receiptAmount: Number(stockReceiptDetail.ThanhTien ?? 0),
      },
    };
  };

  return {
    createStockReceiptDetail: async (payload) => {
      return db.$transaction(async (tx) => {
        const stockReceiptDetail = await tx.cT_PHIEU_NHAP.create({
          data: {
            ...buildWriteData(payload, WRITE_FIELDS),
            ThanhTien: calculateImportLineTotal(payload.SoLuong, payload.DonGiaNhap),
          },
        });

        await adjustPartStock(tx, stockReceiptDetail.MaVatTu, Number(stockReceiptDetail.SoLuong));
        await syncStockReceiptTotal(tx, stockReceiptDetail.MaPhieuNhap);

        return buildMutationResponse(tx, stockReceiptDetail);
      }, TRANSACTION_OPTIONS);
    },
    getStockReceiptDetailList: async ({ page = 1, limit = 10, search = "", ...filters } = {}) => {
      const pagination = buildPagination({ page, limit });
      const where = buildListWhere({
        search,
        filters,
        filterFields: STOCK_RECEIPT_DETAIL_FILTER_FIELDS,
      });

      const [totalItems, stockReceiptDetails] = await db.$transaction([
        db.cT_PHIEU_NHAP.count({ where }),
        db.cT_PHIEU_NHAP.findMany({
          where,
          skip: pagination.skip,
          take: pagination.limit,
          include: STOCK_RECEIPT_DETAIL_INCLUDE_RELATIONS,
          orderBy: {
            MaCTPN: "desc",
          },
        }),
      ]);

      return {
        items: stockReceiptDetails.map(normalizeListItem),
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          totalItems,
          totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pagination.limit),
        },
      };
    },
    getStockReceiptDetailById: async (id) => getStockReceiptDetailByIdInternal(db, id),
    updateStockReceiptDetail: async (id, payload) => {
      return db.$transaction(async (tx) => {
        const existingStockReceiptDetail = await getStockReceiptDetailByIdInternal(tx, id);
        const updateData = buildWriteData(payload, WRITE_FIELDS);
        const nextPartId = updateData.MaVatTu ?? existingStockReceiptDetail.MaVatTu;
        const nextStockReceiptId = updateData.MaPhieuNhap ?? existingStockReceiptDetail.MaPhieuNhap;
        const nextQuantity = updateData.SoLuong ?? existingStockReceiptDetail.SoLuong;
        const nextImportPrice = updateData.DonGiaNhap ?? existingStockReceiptDetail.DonGiaNhap;

      if (nextPartId === existingStockReceiptDetail.MaVatTu) {
        await adjustPartStock(
          tx,
          existingStockReceiptDetail.MaVatTu,
          calculateImportStockAdjustment(existingStockReceiptDetail.SoLuong, nextQuantity),
        );
      } else {
        await adjustPartStock(tx, existingStockReceiptDetail.MaVatTu, -Number(existingStockReceiptDetail.SoLuong));
        await adjustPartStock(tx, nextPartId, Number(nextQuantity));
      }

        const updatedStockReceiptDetail = await tx.cT_PHIEU_NHAP.update({
          where: {
            MaCTPN: Number(id),
          },
          data: {
            ...updateData,
            ThanhTien: calculateImportLineTotal(nextQuantity, nextImportPrice),
          },
        });

        await syncStockReceiptTotal(tx, existingStockReceiptDetail.MaPhieuNhap);

        if (nextStockReceiptId !== existingStockReceiptDetail.MaPhieuNhap) {
          await syncStockReceiptTotal(tx, nextStockReceiptId);
        }

        return buildMutationResponse(tx, updatedStockReceiptDetail);
      }, TRANSACTION_OPTIONS);
    },
    deleteStockReceiptDetail: async (id) => {
      return db.$transaction(async (tx) => {
        const existingStockReceiptDetail = await getStockReceiptDetailByIdInternal(tx, id);
        const deletedStockReceiptDetail = await tx.cT_PHIEU_NHAP.delete({
          where: {
            MaCTPN: Number(id),
          },
        });

        await adjustPartStock(tx, existingStockReceiptDetail.MaVatTu, -Number(existingStockReceiptDetail.SoLuong));
        await syncStockReceiptTotal(tx, existingStockReceiptDetail.MaPhieuNhap);

        return buildMutationResponse(tx, deletedStockReceiptDetail);
      }, TRANSACTION_OPTIONS);
    },
  };
};

const stockReceiptDetailService = createStockReceiptDetailService();

export { createStockReceiptDetailService };
export default stockReceiptDetailService;
