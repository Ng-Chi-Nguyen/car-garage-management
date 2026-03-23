import Joi from "joi";

import createCrudValidator from "../../shared/crud/crud.validatorFactory.js";

const SUPPLIER_FILTER_FIELDS = {
  MaNCC: { type: "number" },
  TenNCC: { type: "string" },
  DienThoai: { type: "string" },
  Email: { type: "string" },
  NguoiLienHe: { type: "string" },
  DiaChi: { type: "string" },
};

const supplierSchema = createCrudValidator({
  createBodySchema: Joi.object({
    TenNCC: Joi.string().trim().max(100).required(),
    DienThoai: Joi.string().trim().max(20).required(),
    Email: Joi.string().trim().email().max(100).allow(null, ""),
    NguoiLienHe: Joi.string().trim().max(100).allow(null, ""),
    DiaChi: Joi.string().trim().max(255).required(),
  }).unknown(false),
  updateBodySchema: Joi.object({
    TenNCC: Joi.string().trim().max(100),
    DienThoai: Joi.string().trim().max(20),
    Email: Joi.string().trim().email().max(100).allow(null, ""),
    NguoiLienHe: Joi.string().trim().max(100).allow(null, ""),
    DiaChi: Joi.string().trim().max(255),
  })
    .min(1)
    .unknown(false),
  filterFields: SUPPLIER_FILTER_FIELDS,
});

export default supplierSchema;
