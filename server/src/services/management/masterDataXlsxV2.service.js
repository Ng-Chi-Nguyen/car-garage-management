import Joi from "joi";

import prisma from "../../db/prisma.js";
import carBrandSchema from "../../validator/management/carBrand.validator.js";
import customerSchema from "../../validator/management/customer.validator.js";
import laborFeeSchema from "../../validator/management/laborFee.validator.js";
import partSchema from "../../validator/management/part.validator.js";
import paymentReceiptSchema from "../../validator/management/paymentReceipt.validator.js";
import repairOrderDetailSchema from "../../validator/management/repairOrderDetail.validator.js";
import repairOrderSchema from "../../validator/management/repairOrder.validator.js";
import stockReceiptDetailSchema from "../../validator/management/stockReceiptDetail.validator.js";
import stockReceiptSchema from "../../validator/management/stockReceipt.validator.js";
import supplierSchema from "../../validator/management/supplier.validator.js";
import vehicleSchema from "../../validator/management/vehicle.validator.js";
import { buildServiceError } from "../../shared/crud/crud.helpers.js";
import {
  calculateImportLineTotal,
  calculateRepairLineTotal,
} from "../../shared/crud/crudBusiness.helpers.js";
import { createXlsxService } from "../../shared/xlsx/xlsx.service.js";

const formatDateOnly = (value) =>
  value instanceof Date ? value.toISOString().slice(0, 10) : value;

const DATE_CELL_VALIDATION = {
  type: "date",
  operator: "between",
  formulae: ["DATE(2000,1,1)", "DATE(2100,12,31)"],
  error: "Vui long nhap ngay hop le theo dinh dang yyyy-mm-dd.",
  prompt: "Nhap ngay theo dinh dang yyyy-mm-dd.",
};
const TEMPLATE_DROPDOWN_MAX_ROW = 10000;

const buildSupplierDropdownWorkbook = async ({ workbook, worksheet }) => {
  const suppliers = await prisma.nHA_CUNG_CAP.findMany({
    select: {
      MaNCC: true,
      TenNCC: true,
    },
    orderBy: {
      MaNCC: "asc",
    },
  });

  if (!suppliers.length) {
    return;
  }

  const listSheetName = "_supplier_lists";
  const existingSheet = workbook.getWorksheet(listSheetName);
  if (existingSheet) {
    workbook.removeWorksheet(existingSheet.id);
  }

  const listWorksheet = workbook.addWorksheet(listSheetName);
  listWorksheet.state = "veryHidden";
  listWorksheet.getCell("A1").value = "SupplierOption";

  suppliers.forEach((supplier, index) => {
    listWorksheet.getCell(`A${index + 2}`).value = `${supplier.MaNCC} - ${supplier.TenNCC}`;
  });

  const maNccColumnIndex = worksheet.columns.findIndex((column) => column?.key === "MaNCC");
  if (maNccColumnIndex === -1) {
    return;
  }

  const columnLetter = worksheet.getColumn(maNccColumnIndex + 1).letter;
  const formula = `'${listSheetName}'!$A$2:$A$${suppliers.length + 1}`;

  for (let rowNumber = 2; rowNumber <= TEMPLATE_DROPDOWN_MAX_ROW; rowNumber += 1) {
    worksheet.getCell(`${columnLetter}${rowNumber}`).dataValidation = {
      type: "list",
      allowBlank: true,
      showErrorMessage: true,
      errorStyle: "stop",
      errorTitle: "Gia tri khong hop le",
      error: "Vui long chon nha cung cap trong danh sach goi y.",
      promptTitle: "MaNCC",
      prompt: "Chon theo dinh dang MaNCC - TenNCC.",
      formulae: [formula],
    };
  }
};

const buildVehicleWorkbook = async ({ workbook, worksheet }) => {
  const carBrands = await prisma.hIEU_XE.findMany({
    select: {
      MaHieuXe: true,
      TenHieuXe: true,
    },
    orderBy: {
      MaHieuXe: "asc",
    },
  });

  if (!carBrands.length) {
    return;
  }

  const listSheetName = "_vehicle_lists";
  const existingSheet = workbook.getWorksheet(listSheetName);
  if (existingSheet) {
    workbook.removeWorksheet(existingSheet.id);
  }

  const listWorksheet = workbook.addWorksheet(listSheetName);
  listWorksheet.state = "veryHidden";
  listWorksheet.getCell("A1").value = "CarBrandOption";

  carBrands.forEach((carBrand, index) => {
    listWorksheet.getCell(`A${index + 2}`).value = `${carBrand.MaHieuXe} - ${carBrand.TenHieuXe}`;
  });

  const brandColumnIndex = worksheet.columns.findIndex((column) => column?.key === "MaHieuXe");
  if (brandColumnIndex === -1) {
    return;
  }

  const columnLetter = worksheet.getColumn(brandColumnIndex + 1).letter;
  const formula = `'${listSheetName}'!$A$2:$A$${carBrands.length + 1}`;

  for (let rowNumber = 2; rowNumber <= TEMPLATE_DROPDOWN_MAX_ROW; rowNumber += 1) {
    worksheet.getCell(`${columnLetter}${rowNumber}`).dataValidation = {
      type: "list",
      allowBlank: false,
      showErrorMessage: true,
      errorStyle: "stop",
      errorTitle: "Gia tri khong hop le",
      error: "Vui long chon hieu xe trong danh sach goi y.",
      promptTitle: "MaHieuXe",
      prompt: "Chon theo dinh dang MaHieuXe - TenHieuXe.",
      formulae: [formula],
    };
  }
};

const buildRepairOrderWorkbook = async ({ workbook, worksheet }) => {
  const vehicles = await prisma.xE.findMany({
    select: {
      MaXe: true,
      BienSo: true,
    },
    orderBy: {
      MaXe: "asc",
    },
  });

  if (!vehicles.length) {
    return;
  }

  const listSheetName = "_repair_order_lists";
  const existingSheet = workbook.getWorksheet(listSheetName);
  if (existingSheet) {
    workbook.removeWorksheet(existingSheet.id);
  }

  const listWorksheet = workbook.addWorksheet(listSheetName);
  listWorksheet.state = "veryHidden";
  listWorksheet.getCell("A1").value = "VehicleOption";

  vehicles.forEach((vehicle, index) => {
    listWorksheet.getCell(`A${index + 2}`).value = `${vehicle.MaXe} - ${vehicle.BienSo}`;
  });

  const vehicleColumnIndex = worksheet.columns.findIndex((column) => column?.key === "MaXe");
  if (vehicleColumnIndex === -1) {
    return;
  }

  const columnLetter = worksheet.getColumn(vehicleColumnIndex + 1).letter;
  const formula = `'${listSheetName}'!$A$2:$A$${vehicles.length + 1}`;

  for (let rowNumber = 2; rowNumber <= TEMPLATE_DROPDOWN_MAX_ROW; rowNumber += 1) {
    worksheet.getCell(`${columnLetter}${rowNumber}`).dataValidation = {
      type: "list",
      allowBlank: false,
      showErrorMessage: true,
      errorStyle: "stop",
      errorTitle: "Gia tri khong hop le",
      error: "Vui long chon xe trong danh sach goi y.",
      promptTitle: "MaXe",
      prompt: "Chon theo dinh dang MaXe - BienSo.",
      formulae: [formula],
    };
  }
};

const buildRepairOrderDetailWorkbook = async ({ workbook, worksheet }) => {
  const [parts, laborFees] = await Promise.all([
    prisma.vAT_TU.findMany({
      select: {
        MaVatTu: true,
        TenVatTu: true,
      },
      orderBy: {
        MaVatTu: "asc",
      },
    }),
    prisma.tIEN_CONG.findMany({
      select: {
        MaTienCong: true,
        NoiDung: true,
      },
      orderBy: {
        MaTienCong: "asc",
      },
    }),
  ]);

  if (!parts.length && !laborFees.length) {
    return;
  }

  const listSheetName = "_repair_detail_lists";
  const existingSheet = workbook.getWorksheet(listSheetName);
  if (existingSheet) {
    workbook.removeWorksheet(existingSheet.id);
  }

  const listWorksheet = workbook.addWorksheet(listSheetName);
  listWorksheet.state = "veryHidden";
  listWorksheet.getCell("A1").value = "PartOption";
  listWorksheet.getCell("B1").value = "LaborFeeOption";

  parts.forEach((part, index) => {
    listWorksheet.getCell(`A${index + 2}`).value = `${part.MaVatTu} - ${part.TenVatTu}`;
  });

  laborFees.forEach((laborFee, index) => {
    listWorksheet.getCell(`B${index + 2}`).value = `${laborFee.MaTienCong} - ${laborFee.NoiDung}`;
  });

  const partColumnIndex = worksheet.columns.findIndex((column) => column?.key === "MaVatTu");
  if (partColumnIndex !== -1 && parts.length) {
    const columnLetter = worksheet.getColumn(partColumnIndex + 1).letter;
    const formula = `'${listSheetName}'!$A$2:$A$${parts.length + 1}`;

    for (let rowNumber = 2; rowNumber <= TEMPLATE_DROPDOWN_MAX_ROW; rowNumber += 1) {
      worksheet.getCell(`${columnLetter}${rowNumber}`).dataValidation = {
        type: "list",
        allowBlank: false,
        showErrorMessage: true,
        errorStyle: "stop",
        errorTitle: "Gia tri khong hop le",
        error: "Vui long chon vat tu trong danh sach goi y.",
        promptTitle: "MaVatTu",
        prompt: "Chon theo dinh dang MaVatTu - TenVatTu.",
        formulae: [formula],
      };
    }
  }

  const laborFeeColumnIndex = worksheet.columns.findIndex((column) => column?.key === "MaTienCong");
  if (laborFeeColumnIndex !== -1 && laborFees.length) {
    const columnLetter = worksheet.getColumn(laborFeeColumnIndex + 1).letter;
    const formula = `'${listSheetName}'!$B$2:$B$${laborFees.length + 1}`;

    for (let rowNumber = 2; rowNumber <= TEMPLATE_DROPDOWN_MAX_ROW; rowNumber += 1) {
      worksheet.getCell(`${columnLetter}${rowNumber}`).dataValidation = {
        type: "list",
        allowBlank: false,
        showErrorMessage: true,
        errorStyle: "stop",
        errorTitle: "Gia tri khong hop le",
        error: "Vui long chon tien cong trong danh sach goi y.",
        promptTitle: "MaTienCong",
        prompt: "Chon theo dinh dang MaTienCong - NoiDung.",
        formulae: [formula],
      };
    }
  }
};

const buildStockReceiptDetailWorkbook = async ({ workbook, worksheet }) => {
  const [stockReceipts, parts] = await Promise.all([
    prisma.pHIEU_NHAP_KHO.findMany({
      select: {
        MaPhieuNhap: true,
        NgayNhap: true,
      },
      orderBy: {
        MaPhieuNhap: "asc",
      },
    }),
    prisma.vAT_TU.findMany({
      select: {
        MaVatTu: true,
        TenVatTu: true,
      },
      orderBy: {
        MaVatTu: "asc",
      },
    }),
  ]);

  if (!stockReceipts.length && !parts.length) {
    return;
  }

  const listSheetName = "_stock_receipt_detail_lists";
  const existingSheet = workbook.getWorksheet(listSheetName);
  if (existingSheet) {
    workbook.removeWorksheet(existingSheet.id);
  }

  const listWorksheet = workbook.addWorksheet(listSheetName);
  listWorksheet.state = "veryHidden";
  listWorksheet.getCell("A1").value = "StockReceiptOption";
  listWorksheet.getCell("B1").value = "PartOption";

  stockReceipts.forEach((stockReceipt, index) => {
    listWorksheet.getCell(`A${index + 2}`).value =
      `${stockReceipt.MaPhieuNhap} - ${formatDateOnly(stockReceipt.NgayNhap)}`;
  });

  parts.forEach((part, index) => {
    listWorksheet.getCell(`B${index + 2}`).value = `${part.MaVatTu} - ${part.TenVatTu}`;
  });

  const stockReceiptColumnIndex = worksheet.columns.findIndex(
    (column) => column?.key === "MaPhieuNhap",
  );
  if (stockReceiptColumnIndex !== -1 && stockReceipts.length) {
    const columnLetter = worksheet.getColumn(stockReceiptColumnIndex + 1).letter;
    const formula = `'${listSheetName}'!$A$2:$A$${stockReceipts.length + 1}`;

    for (let rowNumber = 2; rowNumber <= TEMPLATE_DROPDOWN_MAX_ROW; rowNumber += 1) {
      worksheet.getCell(`${columnLetter}${rowNumber}`).dataValidation = {
        type: "list",
        allowBlank: false,
        showErrorMessage: true,
        errorStyle: "stop",
        errorTitle: "Gia tri khong hop le",
        error: "Vui long chon phieu nhap trong danh sach goi y.",
        promptTitle: "MaPhieuNhap",
        prompt: "Chon theo dinh dang MaPhieuNhap - NgayNhap.",
        formulae: [formula],
      };
    }
  }

  const partColumnIndex = worksheet.columns.findIndex((column) => column?.key === "MaVatTu");
  if (partColumnIndex !== -1 && parts.length) {
    const columnLetter = worksheet.getColumn(partColumnIndex + 1).letter;
    const formula = `'${listSheetName}'!$B$2:$B$${parts.length + 1}`;

    for (let rowNumber = 2; rowNumber <= TEMPLATE_DROPDOWN_MAX_ROW; rowNumber += 1) {
      worksheet.getCell(`${columnLetter}${rowNumber}`).dataValidation = {
        type: "list",
        allowBlank: false,
        showErrorMessage: true,
        errorStyle: "stop",
        errorTitle: "Gia tri khong hop le",
        error: "Vui long chon vat tu trong danh sach goi y.",
        promptTitle: "MaVatTu",
        prompt: "Chon theo dinh dang MaVatTu - TenVatTu.",
        formulae: [formula],
      };
    }
  }
};

const ENTITY_CONFIGS = {
  "car-brands": createXlsxService({
    entityLabel: "hieu xe",
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
    entityLabel: "khach hang",
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
      {
        key: "ChucVu",
        header: "ChucVu",
        type: "string",
        width: 14,
        validation: {
          type: "list",
          formulae: ['"Admin,NhanVien,KhachHang"'],
        },
      },
      {
        key: "TrangThai",
        header: "TrangThai",
        type: "string",
        width: 16,
        validation: {
          type: "list",
          formulae: ['"HoatDong,BiKhoa,DaXoa"'],
        },
      },
    ],
    createSchema: customerSchema.create.body,
    updateSchema: customerSchema.update.body,
    exportRows: (rows) =>
      rows.map(
        ({
          MatKhau,
          TokenDatLaiMatKhau,
          TokenDatLaiMatKhauHetHanLuc,
          TokenDatLaiMatKhauDaDungLuc,
          ...customer
        }) => customer,
      ),
  }),
  "labor-fees": createXlsxService({
    entityLabel: "tien cong",
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
    entityLabel: "vat tu",
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
    prepareWorkbook: buildSupplierDropdownWorkbook,
    beforeCreate: (payload) => ({
      ...payload,
      SoLuongTon: 0,
    }),
  }),
  suppliers: createXlsxService({
    entityLabel: "nha cung cap",
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
  vehicles: createXlsxService({
    entityLabel: "xe",
    fileBaseName: "vehicles",
    sheetName: "Xe",
    delegateName: "xE",
    idField: "MaXe",
    prismaClient: prisma,
    columns: [
      { key: "MaXe", header: "MaXe", type: "number", width: 12 },
      { key: "BienSo", header: "BienSo", type: "string", width: 18 },
      { key: "MaHieuXe", header: "MaHieuXe", type: "number", width: 14 },
      { key: "MaKH", header: "MaKH", type: "number", width: 12 },
    ],
    createSchema: vehicleSchema.create.body,
    updateSchema: vehicleSchema.update.body,
    prepareWorkbook: buildVehicleWorkbook,
    beforeCreate: (payload) => ({
      ...payload,
      TienNoHienTai: 0,
    }),
  }),
  "repair-orders": createXlsxService({
    entityLabel: "phieu sua chua",
    fileBaseName: "repair-orders",
    sheetName: "PhieuSuaChua",
    delegateName: "pHIEU_SUA_CHUA",
    idField: "MaPhieuSC",
    prismaClient: prisma,
    columns: [
      { key: "MaPhieuSC", header: "MaPhieuSC", type: "number", width: 14 },
      { key: "MaXe", header: "MaXe", type: "number", width: 12 },
      { key: "MaNV", header: "MaNV", type: "number", width: 12 },
      {
        key: "NgaySC",
        header: "NgaySC",
        type: "string",
        width: 18,
        numFmt: "yyyy-mm-dd",
        validation: DATE_CELL_VALIDATION,
      },
      {
        key: "TrangThai",
        header: "TrangThai",
        type: "string",
        width: 16,
        validation: {
          type: "list",
          formulae: ['"TiepNhan,DangSua,HoanTat,Huy"'],
        },
      },
      { key: "NoiDungLoi", header: "NoiDungLoi", type: "string", width: 32 },
      { key: "GhiChu", header: "GhiChu", type: "string", width: 28 },
      { key: "TongTien", header: "TongTien", type: "number", width: 18, numFmt: "#,##0.00" },
    ],
    createSchema: repairOrderSchema.create.body,
    updateSchema: repairOrderSchema.update.body,
    prepareWorkbook: buildRepairOrderWorkbook,
    exportRows: (rows) =>
      rows.map((row) => ({
        ...row,
        NgaySC: formatDateOnly(row.NgaySC),
      })),
  }),
  "repair-order-details": createXlsxService({
    entityLabel: "chi tiet phieu sua chua",
    fileBaseName: "repair-order-details",
    sheetName: "ChiTietPhieuSuaChua",
    delegateName: "cT_PHIEU_SUA_CHUA",
    idField: "MaCTSC",
    prismaClient: prisma,
    columns: [
      { key: "MaCTSC", header: "MaCTSC", type: "number", width: 12 },
      { key: "MaPhieuSC", header: "MaPhieuSC", type: "number", width: 14 },
      { key: "MaVatTu", header: "MaVatTu", type: "number", width: 12 },
      { key: "MaTienCong", header: "MaTienCong", type: "number", width: 14 },
      { key: "SoLuong", header: "SoLuong", type: "number", width: 12 },
      { key: "DonGiaVatTu", header: "DonGiaVatTu", type: "number", width: 18, numFmt: "#,##0.00" },
      { key: "DonGiaTienCong", header: "DonGiaTienCong", type: "number", width: 20, numFmt: "#,##0.00" },
    ],
    createSchema: repairOrderDetailSchema.create.body,
    updateSchema: repairOrderDetailSchema.update.body,
    prepareWorkbook: buildRepairOrderDetailWorkbook,
    beforeCreate: (payload) => ({
      ...payload,
      ThanhTien: calculateRepairLineTotal(
        payload.SoLuong,
        payload.DonGiaVatTu,
        payload.DonGiaTienCong,
      ),
    }),
    beforeUpdate: (payload) => ({
      ...payload,
      ...(payload.SoLuong !== undefined &&
      payload.DonGiaVatTu !== undefined &&
      payload.DonGiaTienCong !== undefined
        ? {
            ThanhTien: calculateRepairLineTotal(
              payload.SoLuong,
              payload.DonGiaVatTu,
              payload.DonGiaTienCong,
            ),
          }
        : {}),
    }),
  }),
  "stock-receipts": createXlsxService({
    entityLabel: "phieu nhap kho",
    fileBaseName: "stock-receipts",
    sheetName: "PhieuNhapKho",
    delegateName: "pHIEU_NHAP_KHO",
    idField: "MaPhieuNhap",
    prismaClient: prisma,
    columns: [
      { key: "MaPhieuNhap", header: "MaPhieuNhap", type: "number", width: 14 },
      { key: "MaNCC", header: "MaNCC", type: "number", width: 12 },
      {
        key: "NgayNhap",
        header: "NgayNhap",
        type: "string",
        width: 18,
        numFmt: "yyyy-mm-dd",
        validation: DATE_CELL_VALIDATION,
      },
    ],
    createSchema: stockReceiptSchema.create.body,
    updateSchema: stockReceiptSchema.update.body,
    prepareWorkbook: buildSupplierDropdownWorkbook,
    beforeCreate: (payload) => ({
      ...payload,
      TongTien: 0,
    }),
    exportRows: (rows) =>
      rows.map((row) => ({
        ...row,
        NgayNhap: formatDateOnly(row.NgayNhap),
      })),
  }),
  "stock-receipt-details": createXlsxService({
    entityLabel: "chi tiet phieu nhap",
    fileBaseName: "stock-receipt-details",
    sheetName: "ChiTietPhieuNhap",
    delegateName: "cT_PHIEU_NHAP",
    idField: "MaCTPN",
    prismaClient: prisma,
    columns: [
      { key: "MaCTPN", header: "MaCTPN", type: "number", width: 12 },
      { key: "MaPhieuNhap", header: "MaPhieuNhap", type: "number", width: 14 },
      { key: "MaVatTu", header: "MaVatTu", type: "number", width: 12 },
      { key: "SoLuong", header: "SoLuong", type: "number", width: 12 },
      { key: "DonGiaNhap", header: "DonGiaNhap", type: "number", width: 18, numFmt: "#,##0.00" },
    ],
    createSchema: stockReceiptDetailSchema.create.body,
    updateSchema: stockReceiptDetailSchema.update.body,
    prepareWorkbook: buildStockReceiptDetailWorkbook,
    beforeCreate: (payload) => ({
      ...payload,
      ThanhTien: calculateImportLineTotal(payload.SoLuong, payload.DonGiaNhap),
    }),
    beforeUpdate: (payload) => ({
      ...payload,
      ...(payload.SoLuong !== undefined && payload.DonGiaNhap !== undefined
        ? {
            ThanhTien: calculateImportLineTotal(payload.SoLuong, payload.DonGiaNhap),
          }
        : {}),
    }),
  }),
  "payment-receipts": createXlsxService({
    entityLabel: "phieu thu tien",
    fileBaseName: "payment-receipts",
    sheetName: "PhieuThuTien",
    delegateName: "pHIEU_THU_TIEN",
    idField: "MaPhieuThu",
    prismaClient: prisma,
    columns: [
      { key: "MaPhieuThu", header: "MaPhieuThu", type: "number", width: 14 },
      { key: "MaXe", header: "MaXe", type: "number", width: 12 },
      { key: "MaNV", header: "MaNV", type: "number", width: 12 },
      {
        key: "NgayThu",
        header: "NgayThu",
        type: "string",
        width: 18,
        numFmt: "yyyy-mm-dd",
        validation: DATE_CELL_VALIDATION,
      },
      { key: "SoTienThu", header: "SoTienThu", type: "number", width: 18, numFmt: "#,##0.00" },
      {
        key: "PhuongThucThu",
        header: "PhuongThucThu",
        type: "string",
        width: 18,
        validation: {
          type: "list",
          formulae: ['"TienMat,ChuyenKhoan"'],
        },
      },
      {
        key: "TrangThai",
        header: "TrangThai",
        type: "string",
        width: 16,
        validation: {
          type: "list",
          formulae: ['"ChoXacNhan,DaThu,Huy"'],
        },
      },
      { key: "GhiChu", header: "GhiChu", type: "string", width: 28 },
    ],
    createSchema: paymentReceiptSchema.create.body,
    updateSchema: paymentReceiptSchema.update.body,
    exportRows: (rows) =>
      rows.map((row) => ({
        ...row,
        NgayThu: formatDateOnly(row.NgayThu),
      })),
  }),
};

const getEntityService = (entity) => {
  const service = ENTITY_CONFIGS[entity];

  if (!service) {
    throw buildServiceError(404, "Khong ho tro entity import/export .xlsx nay.");
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
