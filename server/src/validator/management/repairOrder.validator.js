import Joi from "joi";

import createCrudValidator from "../../shared/crud/crud.validatorFactory.js";

const REPAIR_ORDER_TRANG_THAI_VALUES = ["TiepNhan", "DangSua", "HoanTat", "Huy"];
const REPAIR_ORDER_TRANG_THAI_ALIASES = {
  "tiep nhan": ["TiepNhan"],
  "dang sua": ["DangSua"],
  "hoan tat": ["HoanTat"],
  huy: ["Huy"],
};
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

const repairOrderSchema = createCrudValidator({
  createBodySchema: Joi.object({
    MaXe: Joi.number().integer().positive().required(),
    MaNV: Joi.number().integer().positive().allow(null),
    NgaySC: Joi.date().required(),
    TrangThai: Joi.string().valid(...REPAIR_ORDER_TRANG_THAI_VALUES).default("TiepNhan"),
    NoiDungLoi: Joi.string().trim().max(255).allow(null, ""),
    GhiChu: Joi.string().trim().max(255).allow(null, ""),
  }).unknown(false),
  updateBodySchema: Joi.object({
    MaXe: Joi.number().integer().positive(),
    MaNV: Joi.number().integer().positive().allow(null),
    NgaySC: Joi.date(),
    TrangThai: Joi.string().valid(...REPAIR_ORDER_TRANG_THAI_VALUES),
    NoiDungLoi: Joi.string().trim().max(255).allow(null, ""),
    GhiChu: Joi.string().trim().max(255).allow(null, ""),
  })
    .min(1)
    .unknown(false),
  filterFields: REPAIR_ORDER_FILTER_FIELDS,
});

export default repairOrderSchema;
