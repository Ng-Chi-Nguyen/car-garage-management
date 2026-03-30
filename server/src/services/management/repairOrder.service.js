import { Prisma } from "@prisma/client";

import prisma from "../../db/prisma.js";
import {
  buildPagination,
  buildListWhere,
  runWithDbRetry,
  buildServiceError,
  buildWriteData,
} from "../../shared/crud/crud.helpers.js";
import { syncVehicleDebt } from "../../shared/crud/crudBusiness.helpers.js";

const REPAIR_ORDER_TRANG_THAI_VALUES = ["TiepNhan", "DangSua", "HoanTat"];
const REPAIR_ORDER_TRANG_THAI_ALIASES = {
  "tiep nhan": ["TiepNhan"],
  "dang sua": ["DangSua"],
  "hoan tat": ["HoanTat"],
};
const REPAIR_ORDER_SEARCH_FIELDS = [
  {
    field: "TrangThai",
    type: "enum",
    values: REPAIR_ORDER_TRANG_THAI_VALUES,
    aliases: REPAIR_ORDER_TRANG_THAI_ALIASES,
  },
  "NoiDungLoi",
  "GhiChu",
];
const REPAIR_ORDER_FILTER_FIELDS = {
  MaPhieuSC: { type: "number", positive: true },
  MaXe: { type: "number", positive: true },
  MaNV: { type: "number", positive: true },
  NgaySCFrom: { type: "dateFrom", targetField: "NgaySC" },
  NgaySCTo: { type: "dateTo", targetField: "NgaySC" },
  TrangThai: {
    type: "enum",
    values: REPAIR_ORDER_TRANG_THAI_VALUES,
    multi: true,
    aliases: REPAIR_ORDER_TRANG_THAI_ALIASES,
  },
  NoiDungLoi: { type: "string" },
  GhiChu: { type: "string" },
  TongTien: { type: "decimal", min: 0 },
  NgayTaoFrom: { type: "dateFrom", targetField: "NgayTao" },
  NgayTaoTo: { type: "dateTo", targetField: "NgayTao" },
  NgayCapNhatFrom: { type: "dateFrom", targetField: "NgayCapNhat" },
  NgayCapNhatTo: { type: "dateTo", targetField: "NgayCapNhat" },
};

const WRITE_FIELDS = ["MaXe", "MaNV", "NgaySC", "TrangThai", "NoiDungLoi", "GhiChu", "TongTien"];
const TRANSACTION_OPTIONS = {
  isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
};

const getRepairOrderByIdInternal = async (db, id) => {
  const repairOrder = await db.pHIEU_SUA_CHUA.findUnique({
    where: {
      MaPhieuSC: Number(id),
    },
  });

  if (!repairOrder) {
    throw buildServiceError(404, "Không tìm thấy phiếu sửa chữa.");
  }

  return repairOrder;
};

const repairOrderService = {
  createRepairOrder: async (payload) => {
    return prisma.$transaction(async (tx) => {
      const repairOrder = await tx.pHIEU_SUA_CHUA.create({
        data: {
          ...buildWriteData(payload, WRITE_FIELDS),
        },
      });

      await syncVehicleDebt(tx, repairOrder.MaXe);

      return repairOrder;
    }, TRANSACTION_OPTIONS);
  },
  getRepairOrderList: async ({ page = 1, limit = 10, search = "", ...filters } = {}) => {
    const pagination = buildPagination({ page, limit });
    const where = buildListWhere({
      search,
      filters,
      searchFields: REPAIR_ORDER_SEARCH_FIELDS,
      filterFields: REPAIR_ORDER_FILTER_FIELDS,
    });

    const [totalItems, repairOrders] = await runWithDbRetry(() => Promise.all([
      prisma.pHIEU_SUA_CHUA.count({ where }),
      prisma.pHIEU_SUA_CHUA.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: {
          MaPhieuSC: "desc",
        },
      }),
    ]));

    return {
      repairOrders,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pagination.limit),
      },
    };
  },
  getRepairOrderById: async (id) => getRepairOrderByIdInternal(prisma, id),
  updateRepairOrder: async (id, payload) => {
    return prisma.$transaction(async (tx) => {
      const existingRepairOrder = await getRepairOrderByIdInternal(tx, id);
      const updatedRepairOrder = await tx.pHIEU_SUA_CHUA.update({
        where: {
          MaPhieuSC: Number(id),
        },
        data: buildWriteData(payload, WRITE_FIELDS),
      });

      await syncVehicleDebt(tx, existingRepairOrder.MaXe);

      if (updatedRepairOrder.MaXe !== existingRepairOrder.MaXe) {
        await syncVehicleDebt(tx, updatedRepairOrder.MaXe);
      }

      return updatedRepairOrder;
    }, TRANSACTION_OPTIONS);
  },
  deleteRepairOrder: async (id) => {
    return prisma.$transaction(async (tx) => {
      const existingRepairOrder = await getRepairOrderByIdInternal(tx, id);
      const deletedRepairOrder = await tx.pHIEU_SUA_CHUA.delete({
        where: {
          MaPhieuSC: Number(id),
        },
      });

      await syncVehicleDebt(tx, existingRepairOrder.MaXe);

      return deletedRepairOrder;
    }, TRANSACTION_OPTIONS);
  },
};

export default repairOrderService;
