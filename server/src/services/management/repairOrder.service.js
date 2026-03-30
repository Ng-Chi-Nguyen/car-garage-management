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

const REPAIR_ORDER_TRANG_THAI_VALUES = ["TiepNhan", "DangSua", "HoanTat", "Huy"];
const REPAIR_ORDER_TRANG_THAI_ALIASES = {
  "tiep nhan": ["TiepNhan"],
  "dang sua": ["DangSua"],
  "hoan tat": ["HoanTat"],
  huy: ["Huy"],
};
const REPAIR_ORDER_COMPLETED_STATUSES = new Set(["HoanTat", "Huy"]);
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
const REPAIR_ORDER_LIST_SELECT = {
  MaPhieuSC: true,
  MaXe: true,
  MaNV: true,
  NgaySC: true,
  TrangThai: true,
  NoiDungLoi: true,
  GhiChu: true,
  TongTien: true,
  NgayTao: true,
  NgayCapNhat: true,
};
const TRANSACTION_OPTIONS = {
  isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
};

const isCompletedStatus = (status) => REPAIR_ORDER_COMPLETED_STATUSES.has(status);

const getCreateEndDate = (writeData, nowProvider) => {
  const nextStatus = writeData.TrangThai ?? "TiepNhan";

  if (!isCompletedStatus(nextStatus)) {
    return undefined;
  }

  return nowProvider();
};

const getUpdateEndDate = (existingRepairOrder, writeData, nowProvider) => {
  const currentStatus = existingRepairOrder.TrangThai;
  const nextStatus = writeData.TrangThai ?? currentStatus;
  const wasCompleted = isCompletedStatus(currentStatus);
  const willBeCompleted = isCompletedStatus(nextStatus);

  if (!wasCompleted && willBeCompleted) {
    return nowProvider();
  }

  if (wasCompleted && !willBeCompleted) {
    return null;
  }

  return undefined;
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

const createRepairOrderService = ({
  db = prisma,
  now = () => new Date(),
  businessHelpers = {},
} = {}) => {
  const {
    syncVehicleDebt: syncVehicleDebtHelper = syncVehicleDebt,
  } = businessHelpers;

  return {
    createRepairOrder: async (payload) => {
      return db.$transaction(async (tx) => {
        const writeData = buildWriteData(payload, WRITE_FIELDS);
        const endDate = getCreateEndDate(writeData, now);

        if (endDate !== undefined) {
          writeData.NgayKetThuc = endDate;
        }

        const repairOrder = await tx.pHIEU_SUA_CHUA.create({
          data: writeData,
        });

        await syncVehicleDebtHelper(tx, repairOrder.MaXe);

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
        db.pHIEU_SUA_CHUA.count({ where }),
        db.pHIEU_SUA_CHUA.findMany({
          where,
          skip: pagination.skip,
          take: pagination.limit,
          select: REPAIR_ORDER_LIST_SELECT,
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
    getRepairOrderById: async (id) => getRepairOrderByIdInternal(db, id),
    updateRepairOrder: async (id, payload) => {
      return db.$transaction(async (tx) => {
        const existingRepairOrder = await getRepairOrderByIdInternal(tx, id);
        const writeData = buildWriteData(payload, WRITE_FIELDS);
        const endDate = getUpdateEndDate(existingRepairOrder, writeData, now);

        if (endDate !== undefined) {
          writeData.NgayKetThuc = endDate;
        }

        const updatedRepairOrder = await tx.pHIEU_SUA_CHUA.update({
          where: {
            MaPhieuSC: Number(id),
          },
          data: writeData,
        });

        await syncVehicleDebtHelper(tx, existingRepairOrder.MaXe);

        if (updatedRepairOrder.MaXe !== existingRepairOrder.MaXe) {
          await syncVehicleDebtHelper(tx, updatedRepairOrder.MaXe);
        }

        return updatedRepairOrder;
      }, TRANSACTION_OPTIONS);
    },
    deleteRepairOrder: async (id) => {
      return db.$transaction(async (tx) => {
        const existingRepairOrder = await getRepairOrderByIdInternal(tx, id);
        const deletedRepairOrder = await tx.pHIEU_SUA_CHUA.delete({
          where: {
            MaPhieuSC: Number(id),
          },
        });

        await syncVehicleDebtHelper(tx, existingRepairOrder.MaXe);

        return deletedRepairOrder;
      }, TRANSACTION_OPTIONS);
    },
  };
};

const repairOrderService = createRepairOrderService();

export { createRepairOrderService };
export default repairOrderService;
