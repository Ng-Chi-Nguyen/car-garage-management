import { Prisma } from "@prisma/client";

import prisma from "../../db/prisma.js";
import {
  buildListWhere,
  buildPagination,
  runWithDbRetry,
  buildServiceError,
  buildWriteData,
} from "../../shared/crud/crud.helpers.js";
import {
  ensurePaymentWithinDebt,
  syncVehicleDebt,
} from "../../shared/crud/crudBusiness.helpers.js";

const PAYMENT_RECEIPT_PHUONG_THUC_THU_VALUES = ["TienMat", "ChuyenKhoan"];
const PAYMENT_RECEIPT_TRANG_THAI_VALUES = ["ChoXacNhan", "DaThu", "Huy"];
const PAYMENT_RECEIPT_PHUONG_THUC_THU_ALIASES = {
  "tien mat": ["TienMat"],
  "chuyen khoan": ["ChuyenKhoan"],
};
const PAYMENT_RECEIPT_TRANG_THAI_ALIASES = {
  "cho xac nhan": ["ChoXacNhan"],
  "da thu": ["DaThu"],
  huy: ["Huy"],
};
const PAYMENT_RECEIPT_SEARCH_FIELDS = [
  {
    field: "PhuongThucThu",
    type: "enum",
    values: PAYMENT_RECEIPT_PHUONG_THUC_THU_VALUES,
    aliases: PAYMENT_RECEIPT_PHUONG_THUC_THU_ALIASES,
  },
  {
    field: "TrangThai",
    type: "enum",
    values: PAYMENT_RECEIPT_TRANG_THAI_VALUES,
    aliases: PAYMENT_RECEIPT_TRANG_THAI_ALIASES,
  },
  "GhiChu",
];
const PAYMENT_RECEIPT_FILTER_FIELDS = {
  MaPhieuThu: { type: "number", positive: true },
  MaXe: { type: "number", positive: true },
  MaNV: { type: "number", positive: true },
  NgayThuFrom: { type: "dateFrom", targetField: "NgayThu" },
  NgayThuTo: { type: "dateTo", targetField: "NgayThu" },
  SoTienThu: { type: "decimal", min: 0 },
  PhuongThucThu: {
    type: "enum",
    values: PAYMENT_RECEIPT_PHUONG_THUC_THU_VALUES,
    multi: true,
    aliases: PAYMENT_RECEIPT_PHUONG_THUC_THU_ALIASES,
  },
  TrangThai: {
    type: "enum",
    values: PAYMENT_RECEIPT_TRANG_THAI_VALUES,
    multi: true,
    aliases: PAYMENT_RECEIPT_TRANG_THAI_ALIASES,
  },
  GhiChu: { type: "string" },
  NgayTaoFrom: { type: "dateFrom", targetField: "NgayTao" },
  NgayTaoTo: { type: "dateTo", targetField: "NgayTao" },
  NgayCapNhatFrom: { type: "dateFrom", targetField: "NgayCapNhat" },
  NgayCapNhatTo: { type: "dateTo", targetField: "NgayCapNhat" },
};

const WRITE_FIELDS = ["MaXe", "MaNV", "NgayThu", "SoTienThu", "PhuongThucThu", "TrangThai", "GhiChu"];
const TRANSACTION_OPTIONS = {
  isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
};
const normalizePaymentReceiptPayload = (payload) => {
  return payload?.paymentReceipt ?? payload;
};

const ensureValidPaymentReceiptCreatePayload = (payload) => {
  const paymentReceipt = normalizePaymentReceiptPayload(payload);

  if (!paymentReceipt || paymentReceipt.MaXe === undefined || paymentReceipt.SoTienThu === undefined || paymentReceipt.NgayThu === undefined) {
    throw buildServiceError(400, "Dữ liệu phiếu thu tiền không hợp lệ.");
  }

  const maXe = Number(paymentReceipt.MaXe);
  const soTienThu = Number(paymentReceipt.SoTienThu);

  if (!Number.isInteger(maXe) || maXe <= 0 || !Number.isFinite(soTienThu) || soTienThu <= 0) {
    throw buildServiceError(400, "Dữ liệu phiếu thu tiền không hợp lệ.");
  }

  return {
    ...paymentReceipt,
    MaXe: maXe,
    MaNV:
      paymentReceipt.MaNV === null || paymentReceipt.MaNV === undefined
        ? paymentReceipt.MaNV
        : Number(paymentReceipt.MaNV),
    SoTienThu: soTienThu,
  };
};
const getPaymentReceiptByIdInternal = async (db, id) => {
  const paymentReceipt = await db.pHIEU_THU_TIEN.findUnique({
    where: {
      MaPhieuThu: Number(id),
    },
  });

  if (!paymentReceipt) {
    throw buildServiceError(404, "Không tìm thấy phiếu thu tiền.");
  }

  return paymentReceipt;
};

const paymentReceiptService = {
  createPaymentReceipt: async (payload) => {
    const createPayload = ensureValidPaymentReceiptCreatePayload(payload);

    return prisma.$transaction(async (tx) => {
      const existingVehicle = await tx.xE.findUnique({
        where: { MaXe: createPayload.MaXe },
        select: { MaXe: true },
      });

      if (!existingVehicle) {
        throw buildServiceError(404, "Không tìm thấy xe.");
      }

      await ensurePaymentWithinDebt(tx, createPayload.MaXe, createPayload.SoTienThu);

      const paymentReceipt = await tx.pHIEU_THU_TIEN.create({
        data: buildWriteData(createPayload, WRITE_FIELDS),
      });

      await syncVehicleDebt(tx, paymentReceipt.MaXe);

      return paymentReceipt;
    }, TRANSACTION_OPTIONS);
  },
  getPaymentReceiptList: async ({
    page = 1,
    limit = 10,
    search = "",
    ...filters
  } = {}) => {
    const pagination = buildPagination({ page, limit });
    const where = buildListWhere({
      search,
      filters,
      searchFields: PAYMENT_RECEIPT_SEARCH_FIELDS,
      filterFields: PAYMENT_RECEIPT_FILTER_FIELDS,
    });

    const [totalItems, paymentReceipts] = await runWithDbRetry(() => Promise.all([
      prisma.pHIEU_THU_TIEN.count({ where }),
      prisma.pHIEU_THU_TIEN.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: {
          MaPhieuThu: "desc",
        },
      }),
    ]));

    return {
      paymentReceipts,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pagination.limit),
      },
    };
  },
  getPaymentReceiptById: async (id) => getPaymentReceiptByIdInternal(prisma, id),
  updatePaymentReceipt: async (id, payload) => {
    return prisma.$transaction(async (tx) => {
      const existingPaymentReceipt = await getPaymentReceiptByIdInternal(tx, id);
      const updateData = buildWriteData(payload, WRITE_FIELDS);
      const nextVehicleId = updateData.MaXe ?? existingPaymentReceipt.MaXe;
      const nextAmount = updateData.SoTienThu ?? existingPaymentReceipt.SoTienThu;
      const excludedPaymentId = nextVehicleId === existingPaymentReceipt.MaXe ? id : undefined;

      await ensurePaymentWithinDebt(tx, nextVehicleId, nextAmount, excludedPaymentId);

      const updatedPaymentReceipt = await tx.pHIEU_THU_TIEN.update({
        where: {
          MaPhieuThu: Number(id),
        },
        data: updateData,
      });

      await syncVehicleDebt(tx, existingPaymentReceipt.MaXe);

      if (updatedPaymentReceipt.MaXe !== existingPaymentReceipt.MaXe) {
        await syncVehicleDebt(tx, updatedPaymentReceipt.MaXe);
      }

      return updatedPaymentReceipt;
    }, TRANSACTION_OPTIONS);
  },
  deletePaymentReceipt: async (id) => {
    return prisma.$transaction(async (tx) => {
      const existingPaymentReceipt = await getPaymentReceiptByIdInternal(tx, id);
      const deletedPaymentReceipt = await tx.pHIEU_THU_TIEN.delete({
        where: {
          MaPhieuThu: Number(id),
        },
      });

      await syncVehicleDebt(tx, existingPaymentReceipt.MaXe);

      return deletedPaymentReceipt;
    }, TRANSACTION_OPTIONS);
  },
};

export default paymentReceiptService;
