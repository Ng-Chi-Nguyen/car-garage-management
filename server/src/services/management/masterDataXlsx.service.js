import Joi from "joi";

import prisma from "../../db/prisma.js";
import carBrandSchema from "../../validator/management/carBrand.validator.js";
import customerSchema from "../../validator/management/customer.validator.js";
import laborFeeSchema from "../../validator/management/laborFee.validator.js";
import partSchema from "../../validator/management/part.validator.js";
import supplierSchema from "../../validator/management/supplier.validator.js";
import { buildServiceError } from "../../shared/crud/crud.helpers.js";
import { createXlsxService } from "../../shared/xlsx/xlsx.service.js";

const ENTITY_CONFIGS = {
  "car-brands": createXlsxService({
    entityLabel: "hiệu xe",
    fileBaseName: "car-brands",
    sheetName: "HieuXe",
    delegateName: "hIEU_XE",
    idField: "MaHieuXe",
    prismaClient: prisma,
    columns: [
      { key: "MaHieuXe", header: "MaHieuXe", type: "number", width: 14 },
      { key: "TenHieuXe", header: "TenHieuXe", type: "string", width: 28 },
    ],
    createSchema: carBrandSchema.create.body,
    updateSchema: carBrandSchema.update.body,
  }),
  customers: createXlsxService({
    entityLabel: "khách hàng",
    fileBaseName: "customers",
    sheetName: "KhachHang",
    delegateName: "kHACH_HANG",
    idField: "MaKH",
    prismaClient: prisma,
    columns: [
      { key: "MaKH", header: "MaKH", type: "number", width: 12 },
      { key: "Email", header: "Email", type: "string", width: 28 },
      { key: "TenChuXe", header: "TenChuXe", type: "string", width: 24 },
      { key: "DienThoai", header: "DienThoai", type: "string", width: 18 },
      { key: "DiaChi", header: "DiaChi", type: "string", width: 32 },
      { key: "ChucVu", header: "ChucVu", type: "string", width: 14 },
      { key: "TrangThai", header: "TrangThai", type: "string", width: 16 },
    ],
    createSchema: customerSchema.create.body,
    updateSchema: customerSchema.update.body,
    exportRows: (rows) =>
      rows.map(({ MatKhau, TokenDatLaiMatKhau, TokenDatLaiMatKhauHetHanLuc, TokenDatLaiMatKhauDaDungLuc, ...customer }) => customer),
  }),
  "labor-fees": createXlsxService({
    entityLabel: "tiền công",
    fileBaseName: "labor-fees",
    sheetName: "TienCong",
    delegateName: "tIEN_CONG",
    idField: "MaTienCong",
    prismaClient: prisma,
    columns: [
      { key: "MaTienCong", header: "MaTienCong", type: "number", width: 16 },
      { key: "NoiDung", header: "NoiDung", type: "string", width: 36 },
      { key: "DonGia", header: "DonGia", type: "number", width: 18, numFmt: "#,##0.00" },
    ],
    createSchema: laborFeeSchema.create.body,
    updateSchema: laborFeeSchema.update.body,
  }),
  parts: createXlsxService({
    entityLabel: "vật tư",
    fileBaseName: "parts",
    sheetName: "VatTu",
    delegateName: "vAT_TU",
    idField: "MaVatTu",
    prismaClient: prisma,
    columns: [
      { key: "MaVatTu", header: "MaVatTu", type: "number", width: 14 },
      { key: "TenVatTu", header: "TenVatTu", type: "string", width: 28 },
      { key: "DonViTinh", header: "DonViTinh", type: "string", width: 16 },
      { key: "GiaVon", header: "GiaVon", type: "number", width: 18, numFmt: "#,##0.00" },
      { key: "DonGiaBan", header: "DonGiaBan", type: "number", width: 18, numFmt: "#,##0.00" },
      { key: "MaNCC", header: "MaNCC", type: "number", width: 14 },
    ],
    createSchema: partSchema.create.body,
    updateSchema: partSchema.update.body,
  }),
  suppliers: createXlsxService({
    entityLabel: "nhà cung cấp",
    fileBaseName: "suppliers",
    sheetName: "NhaCungCap",
    delegateName: "nHA_CUNG_CAP",
    idField: "MaNCC",
    prismaClient: prisma,
    columns: [
      { key: "MaNCC", header: "MaNCC", type: "number", width: 12 },
      { key: "TenNCC", header: "TenNCC", type: "string", width: 26 },
      { key: "DienThoai", header: "DienThoai", type: "string", width: 18 },
      { key: "Email", header: "Email", type: "string", width: 28 },
      { key: "NguoiLienHe", header: "NguoiLienHe", type: "string", width: 22 },
      { key: "DiaChi", header: "DiaChi", type: "string", width: 32 },
    ],
    createSchema: supplierSchema.create.body,
    updateSchema: supplierSchema.update.body,
  }),
};

const getEntityService = (entity) => {
  const service = ENTITY_CONFIGS[entity];

  if (!service) {
    throw buildServiceError(404, "Không hỗ trợ entity import/export .xlsx này.");
  }

  return service;
};

const masterDataXlsxService = {
  downloadTemplate: async (entity) => {
    const service = getEntityService(entity);
    return {
      fileBaseName: service.fileBaseName,
      buffer: await service.exportDataBuffer(),
    };
  },
  exportData: async (entity) => {
    const service = getEntityService(entity);
    return {
      fileBaseName: service.fileBaseName,
      buffer: await service.exportDataBuffer(),
    };
  },
  importData: async (entity, file) => getEntityService(entity).importRows(file),
  syncData: async (entity, file) => getEntityService(entity).syncRows(file),
  updateData: async (entity, file) => getEntityService(entity).updateRows(file),
};

export const masterDataEntitySchema = Joi.string()
  .valid(...Object.keys(ENTITY_CONFIGS))
  .required();

export default masterDataXlsxService;
