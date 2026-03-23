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
  calculateRepairLineTotal,
  calculateRepairStockAdjustment,
  syncRepairOrderTotal,
} from "../../shared/crud/crudBusiness.helpers.js";

const REPAIR_ORDER_DETAIL_FILTER_FIELDS = {
  MaCTSC: { type: "number", positive: true },
  MaPhieuSC: { type: "number", positive: true },
  MaVatTu: { type: "number", positive: true },
  MaTienCong: { type: "number", positive: true },
  SoLuong: { type: "number", positive: true },
  DonGiaVatTu: { type: "decimal", min: 0 },
  DonGiaTienCong: { type: "decimal", min: 0 },
  ThanhTien: { type: "decimal", min: 0 },
};

const WRITE_FIELDS = ["MaPhieuSC", "MaVatTu", "MaTienCong", "SoLuong", "DonGiaVatTu", "DonGiaTienCong"];
const TRANSACTION_OPTIONS = {
  isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
};

const getRepairOrderDetailByIdInternal = async (db, id) => {
  const repairOrderDetail = await db.cT_PHIEU_SUA_CHUA.findUnique({
    where: {
      MaCTSC: Number(id),
    },
  });

  if (!repairOrderDetail) {
    throw buildServiceError(404, "Không tìm thấy chi tiết phiếu sửa chữa.");
  }

  return repairOrderDetail;
};

const repairOrderDetailService = {
  createRepairOrderDetail: async (payload) => {
    return prisma.$transaction(async (tx) => {
      await adjustPartStock(tx, payload.MaVatTu, -Number(payload.SoLuong));

      const repairOrderDetail = await tx.cT_PHIEU_SUA_CHUA.create({
        data: {
          ...buildWriteData(payload, WRITE_FIELDS),
          ThanhTien: calculateRepairLineTotal(payload.SoLuong, payload.DonGiaVatTu, payload.DonGiaTienCong),
        },
      });

      await syncRepairOrderTotal(tx, repairOrderDetail.MaPhieuSC);

      return repairOrderDetail;
    }, TRANSACTION_OPTIONS);
  },
  getRepairOrderDetailList: async ({ page = 1, limit = 10, search = "", ...filters } = {}) => {
    const pagination = buildPagination({ page, limit });
    const where = buildListWhere({
      search,
      filters,
      filterFields: REPAIR_ORDER_DETAIL_FILTER_FIELDS,
    });

    const [totalItems, repairOrderDetails] = await prisma.$transaction([
      prisma.cT_PHIEU_SUA_CHUA.count({ where }),
      prisma.cT_PHIEU_SUA_CHUA.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: {
          MaCTSC: "desc",
        },
      }),
    ]);

    return {
      repairOrderDetails,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pagination.limit),
      },
    };
  },
  getRepairOrderDetailById: async (id) => getRepairOrderDetailByIdInternal(prisma, id),
  updateRepairOrderDetail: async (id, payload) => {
    return prisma.$transaction(async (tx) => {
      const existingRepairOrderDetail = await getRepairOrderDetailByIdInternal(tx, id);
      const updateData = buildWriteData(payload, WRITE_FIELDS);
      const nextPartId = updateData.MaVatTu ?? existingRepairOrderDetail.MaVatTu;
      const nextRepairOrderId = updateData.MaPhieuSC ?? existingRepairOrderDetail.MaPhieuSC;
      const nextQuantity = updateData.SoLuong ?? existingRepairOrderDetail.SoLuong;
      const nextPartPrice = updateData.DonGiaVatTu ?? existingRepairOrderDetail.DonGiaVatTu;
      const nextLaborPrice = updateData.DonGiaTienCong ?? existingRepairOrderDetail.DonGiaTienCong;

      if (nextPartId === existingRepairOrderDetail.MaVatTu) {
        await adjustPartStock(
          tx,
          existingRepairOrderDetail.MaVatTu,
          calculateRepairStockAdjustment(existingRepairOrderDetail.SoLuong, nextQuantity),
        );
      } else {
        await adjustPartStock(tx, existingRepairOrderDetail.MaVatTu, Number(existingRepairOrderDetail.SoLuong));
        await adjustPartStock(tx, nextPartId, -Number(nextQuantity));
      }

      const updatedRepairOrderDetail = await tx.cT_PHIEU_SUA_CHUA.update({
        where: {
          MaCTSC: Number(id),
        },
        data: {
          ...updateData,
          ThanhTien: calculateRepairLineTotal(nextQuantity, nextPartPrice, nextLaborPrice),
        },
      });

      await syncRepairOrderTotal(tx, existingRepairOrderDetail.MaPhieuSC);

      if (nextRepairOrderId !== existingRepairOrderDetail.MaPhieuSC) {
        await syncRepairOrderTotal(tx, nextRepairOrderId);
      }

      return updatedRepairOrderDetail;
    }, TRANSACTION_OPTIONS);
  },
  deleteRepairOrderDetail: async (id) => {
    return prisma.$transaction(async (tx) => {
      const existingRepairOrderDetail = await getRepairOrderDetailByIdInternal(tx, id);
      const deletedRepairOrderDetail = await tx.cT_PHIEU_SUA_CHUA.delete({
        where: {
          MaCTSC: Number(id),
        },
      });

      await adjustPartStock(tx, existingRepairOrderDetail.MaVatTu, Number(existingRepairOrderDetail.SoLuong));
      await syncRepairOrderTotal(tx, existingRepairOrderDetail.MaPhieuSC);

      return deletedRepairOrderDetail;
    }, TRANSACTION_OPTIONS);
  },
};

export default repairOrderDetailService;
