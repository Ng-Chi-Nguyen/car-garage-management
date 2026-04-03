import Joi from "joi";

import createCrudValidator from "../../shared/crud/crud.validatorFactory.js";

const CUSTOMER_FILTER_FIELDS = {
  MaKH: { type: "number" },
  Email: { type: "string" },
  TenChuXe: { type: "string" },
  DienThoai: { type: "string" },
  DiaChi: { type: "string" },
  ChucVu: { type: "enum", values: ["NhanVien", "KhachHang"] },
  TrangThai: { type: "enum", values: ["HoatDong", "BiKhoa", "DaXoa"], multi: true },
  NgayTaoFrom: { type: "dateFrom", targetField: "NgayTao" },
  NgayTaoTo: { type: "dateTo", targetField: "NgayTao" },
  NgayCapNhatFrom: { type: "dateFrom", targetField: "NgayCapNhat" },
  NgayCapNhatTo: { type: "dateTo", targetField: "NgayCapNhat" },
};

const customerSchema = createCrudValidator({
  createBodySchema: Joi.object({
    Email: Joi.string().trim().max(100).allow(null, ""),
    TenChuXe: Joi.string().trim().max(100).required(),
    DienThoai: Joi.string().trim().max(20).required(),
    DiaChi: Joi.string().trim().max(255).allow("").required(),
    ChucVu: Joi.string().valid("NhanVien", "KhachHang").allow(null, ""),
    TrangThai: Joi.string().valid("HoatDong", "BiKhoa", "DaXoa").allow(null, ""),
  }).unknown(false),
  updateBodySchema: Joi.object({
    Email: Joi.string().trim().max(100).allow(null, ""),
    TenChuXe: Joi.string().trim().max(100),
    DienThoai: Joi.string().trim().max(20),
    DiaChi: Joi.string().trim().max(255).allow(""),
    ChucVu: Joi.string().valid("NhanVien", "KhachHang").allow(null, ""),
    TrangThai: Joi.string().valid("HoatDong", "BiKhoa", "DaXoa").allow(null, ""),
  })
    .min(1)
    .unknown(false),
  listQuerySchema: Joi.object({
    search: Joi.string().trim().allow(""),
  }).unknown(false),
  filterFields: CUSTOMER_FILTER_FIELDS,
});

customerSchema.stats = {
  query: Joi.object({}).unknown(false),
};

export default customerSchema;
