import Joi from "joi";

import createCrudValidator from "../../shared/crud/crud.validatorFactory.js";

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

const paymentReceiptSchema = createCrudValidator({
  createBodySchema: Joi.object({
    MaXe: Joi.number().integer().positive().required(),
    MaNV: Joi.number().integer().positive().allow(null),
    NgayThu: Joi.date().required(),
    SoTienThu: Joi.number().positive().required(),
    PhuongThucThu: Joi.string().valid(...PAYMENT_RECEIPT_PHUONG_THUC_THU_VALUES),
    TrangThai: Joi.string().valid(...PAYMENT_RECEIPT_TRANG_THAI_VALUES),
    GhiChu: Joi.string().trim().max(255).allow(null, ""),
  }).unknown(false),
  updateBodySchema: Joi.object({
    MaXe: Joi.number().integer().positive(),
    MaNV: Joi.number().integer().positive().allow(null),
    NgayThu: Joi.date(),
    SoTienThu: Joi.number().positive(),
    PhuongThucThu: Joi.string().valid(...PAYMENT_RECEIPT_PHUONG_THUC_THU_VALUES),
    TrangThai: Joi.string().valid(...PAYMENT_RECEIPT_TRANG_THAI_VALUES),
    GhiChu: Joi.string().trim().max(255).allow(null, ""),
  })
    .min(1)
    .unknown(false),
  filterFields: PAYMENT_RECEIPT_FILTER_FIELDS,
});

export default paymentReceiptSchema;
