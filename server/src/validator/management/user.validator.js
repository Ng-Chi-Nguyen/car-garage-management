import Joi from "joi";

const customerBodySchema = Joi.object({
  Email: Joi.string().trim().email().max(100).allow(null, ""),
  MatKhau: Joi.string().trim().max(255).allow(null, ""),
  TenChuXe: Joi.string().trim().max(100).required(),
  DienThoai: Joi.string().trim().max(20).required(),
  DiaChi: Joi.string().trim().max(255).allow("").required(),
  ChucVu: Joi.string().valid('NhanVien', 'KhachHang').allow(null, ''),
  TrangThai: Joi.string().valid('HoatDong', 'BiKhoa', 'DaXoa').allow(null, ''),
  Avatar: Joi.string().trim().max(255).allow(null, ""),
}).unknown(false);

const customerUpdateBodySchema = Joi.object({
  Email: Joi.string().trim().email().max(100).allow(null, ""),
  MatKhau: Joi.string().trim().max(255).allow(null, ""),
  TenChuXe: Joi.string().trim().max(100),
  DienThoai: Joi.string().trim().max(20),
  DiaChi: Joi.string().trim().max(255).allow(""),
  ChucVu: Joi.string().valid('NhanVien', 'KhachHang').allow(null, ''),
  TrangThai: Joi.string().valid('HoatDong', 'BiKhoa', 'DaXoa').allow(null, ''),
  Avatar: Joi.string().trim().max(255).allow(null, ""),
}).min(1).unknown(false);

const customerIdParamsSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
}).unknown(false);

const customerListQuerySchema = Joi.object({
  page: Joi.number().integer().positive().default(1),
  limit: Joi.number().integer().positive().default(10),
  search: Joi.string().trim().allow("").optional(),
}).unknown(false);

const userSchema = {
  createUser: {
    body: customerBodySchema,
  },
  getUsersAll: {
    query: customerListQuerySchema,
  },
  getUserById: {
    params: customerIdParamsSchema,
  },
  updateUser: {
    params: customerIdParamsSchema,
    body: customerUpdateBodySchema,
  },
  deleteUser: {
    params: customerIdParamsSchema,
  },
};

export default userSchema;
