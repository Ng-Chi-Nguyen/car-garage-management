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

const getStockReceiptDetailByIdInternal = async (db, id) => {
  const stockReceiptDetail = await db.cT_PHIEU_NHAP.findUnique({
    where: {
      MaCTPN: Number(id),
    },
  });

  if (!stockReceiptDetail) {
    throw buildServiceError(404, "Không tìm thấy chi tiết phiếu nhập.");
  }

  return stockReceiptDetail;
};

const createStockReceiptDetailService = ({ db = prisma } = {}) => {
  const buildMutationResponse = (stockReceiptDetail) => ({
    ...stockReceiptDetail,
    inventoryValueAfter: Number(stockReceiptDetail.ThanhTien ?? 0),
  });

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

        return buildMutationResponse(stockReceiptDetail);
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
        orderBy: {
          MaCTPN: "desc",
        },
        }),
      ]);

      return {
        stockReceiptDetails,
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

        return buildMutationResponse(updatedStockReceiptDetail);
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

        return buildMutationResponse(deletedStockReceiptDetail);
      }, TRANSACTION_OPTIONS);
    },
  };
};

const stockReceiptDetailService = createStockReceiptDetailService();

export { createStockReceiptDetailService };
export default stockReceiptDetailService;
