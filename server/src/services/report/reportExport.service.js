import customerReportService from "./customerReport.service.js";
import dashboardService from "./dashboard.service.js";
import financeReportService from "./financeReport.service.js";
import inventoryReportService from "./inventoryReport.service.js";
import repairReportService from "./repairReport.service.js";
import revenueReportService from "./revenueReport.service.js";
import {
  createReportFileName,
  createReportWorkbookBuffer,
  formatDateValue,
} from "../../shared/xlsx/reportWorkbook.service.js";

const CURRENCY_FORMAT = "#,##0.00";
const INTEGER_FORMAT = "#,##0";
const RATIO_FORMAT = "0.00%";

const toSummaryRows = (entries) =>
  entries
    .filter((entry) => entry.value !== undefined)
    .map((entry) => ({
      category: entry.category,
      value: Array.isArray(entry.value) || typeof entry.value === "object"
        ? JSON.stringify(entry.value)
        : formatDateValue(entry.value),
    }));

const buildSummarySheet = (name, entries) => ({
  name,
  columns: [
    { header: "ChiTieu", key: "category", width: 34 },
    { header: "GiaTri", key: "value", width: 28 },
  ],
  rows: toSummaryRows(entries),
});

const percentRatio = (value) => Number(value ?? 0);

const reportExportService = {
  exportCustomerSummary: async (query) => {
    const data = await customerReportService.getCustomerSummary(query);

    return {
      fileName: createReportFileName("customer-summary-report"),
      buffer: await createReportWorkbookBuffer({
        sheets: [
          buildSummarySheet("TongQuan", [
            { category: "TuNgay", value: query.from },
            { category: "DenNgay", value: query.to },
            { category: "Granularity", value: query.granularity },
            { category: "TongKhachHangMoi", value: data.newCustomersTimeseries.totalNewCustomers },
            { category: "TopDoanhThu_MaKH", value: data.topRevenueCustomer?.customerId ?? "" },
            { category: "TopDoanhThu_TenChuXe", value: data.topRevenueCustomer?.customerName ?? "" },
            { category: "TopDoanhThu_GiaTri", value: data.topRevenueCustomer?.totalRevenue ?? 0 },
            { category: "TopCongNo_MaKH", value: data.topDebtCustomer?.customerId ?? "" },
            { category: "TopCongNo_TenChuXe", value: data.topDebtCustomer?.customerName ?? "" },
            { category: "TopCongNo_GiaTri", value: data.topDebtCustomer?.totalDebt ?? 0 },
          ]),
          {
            name: "KhachHangMoi",
            columns: [
              { header: "Ky", key: "label", width: 18 },
              { header: "SoKhachHangMoi", key: "newCustomers", width: 18, numFmt: INTEGER_FORMAT },
            ],
            rows: data.newCustomersTimeseries.items,
          },
        ],
      }),
    };
  },

  exportDashboardRevenueSummary: async (query) => {
    const data = await dashboardService.getRevenueSummary(query);

    return {
      fileName: createReportFileName("dashboard-revenue-summary-report"),
      buffer: await createReportWorkbookBuffer({
        sheets: [
          buildSummarySheet("TongQuan", [
            { category: "DoanhThuHomNay", value: data.summary.todayRevenue },
            { category: "DoanhThuTuanNay", value: data.summary.weekRevenue },
            { category: "DoanhThuThangNay", value: data.summary.monthRevenue },
            { category: "XeTiepNhanHomNay", value: data.summary.todayReceivedVehicles },
            { category: "PhieuSuaDangXuLy", value: data.summary.activeRepairOrders },
            { category: "TongTienDaThu", value: data.summary.totalCollectedAmount },
            { category: "TongCongNo", value: data.summary.totalOutstandingDebt },
            { category: "VatTuTonThap", value: data.summary.lowStockPartsCount },
          ]),
          {
            name: "CanhBao",
            columns: [
              { header: "Code", key: "code", width: 18 },
              { header: "MucDo", key: "severity", width: 14 },
              { header: "TieuDe", key: "title", width: 28 },
              { header: "NoiDung", key: "message", width: 60 },
            ],
            rows: data.alerts,
          },
        ],
      }),
    };
  },

  exportFinanceSummary: async (query) => {
    const data = await financeReportService.getFinanceSummary(query);

    return {
      fileName: createReportFileName("finance-summary-report"),
      buffer: await createReportWorkbookBuffer({
        sheets: [
          buildSummarySheet("TongQuan", [
            { category: "TuNgay", value: query.from },
            { category: "DenNgay", value: query.to },
            { category: "Granularity", value: query.granularity },
            { category: "TongCongNo", value: data.totalOutstandingDebt },
            { category: "TongDaThu", value: data.collectedAmountTimeseries.totalCollectedAmount },
            { category: "CongNoPhatSinhThangNay", value: data.newDebtInCurrentMonth },
          ]),
          {
            name: "ThuTienTheoKy",
            columns: [
              { header: "Ky", key: "label", width: 18 },
              { header: "SoTienThu", key: "collectedAmount", width: 20, numFmt: CURRENCY_FORMAT },
            ],
            rows: data.collectedAmountTimeseries.items,
          },
        ],
      }),
    };
  },

  exportFinanceDebtors: async (query) => {
    const data = await financeReportService.getFinanceDebtors(query);

    return {
      fileName: createReportFileName("finance-debtors-report"),
      buffer: await createReportWorkbookBuffer({
        sheets: [
          buildSummarySheet("TongQuan", [
            { category: "GroupBy", value: query.groupBy },
            { category: "Search", value: query.search ?? "" },
            { category: "Trang", value: data.pagination.page },
            { category: "GioiHan", value: data.pagination.limit },
            { category: "TongBanGhi", value: data.pagination.totalItems },
            { category: "TongTrang", value: data.pagination.totalPages },
          ]),
          {
            name: "DanhSachCongNo",
            columns: query.groupBy === "customer"
              ? [
                  { header: "MaKH", key: "customerId", width: 12 },
                  { header: "TenChuXe", key: "customerName", width: 28 },
                  { header: "DienThoai", key: "phoneNumber", width: 18 },
                  { header: "SoXeNo", key: "vehicleCount", width: 12, numFmt: INTEGER_FORMAT },
                  { header: "CongNo", key: "outstandingDebt", width: 18, numFmt: CURRENCY_FORMAT },
                ]
              : [
                  { header: "MaXe", key: "vehicleId", width: 12 },
                  { header: "BienSo", key: "licensePlate", width: 18 },
                  { header: "MaKH", key: "customerId", width: 12 },
                  { header: "TenChuXe", key: "customerName", width: 28 },
                  { header: "DienThoai", key: "phoneNumber", width: 18 },
                  { header: "CongNo", key: "outstandingDebt", width: 18, numFmt: CURRENCY_FORMAT },
                ],
            rows: data.items,
          },
        ],
      }),
    };
  },

  exportInventorySummary: async (query) => {
    const data = await inventoryReportService.getInventorySummary(query);

    return {
      fileName: createReportFileName("inventory-summary-report"),
      buffer: await createReportWorkbookBuffer({
        sheets: [
          buildSummarySheet("TongQuan", [
            { category: "TuNgay", value: query.from },
            { category: "DenNgay", value: query.to },
            { category: "TongGiaTriTonKho", value: data.currentInventoryValue.totalValue },
            { category: "TongSoLuongTon", value: data.currentInventoryValue.totalQuantity },
            { category: "SoLuongVatTu", value: data.currentInventoryValue.partCount },
            { category: "NhaCungCapNoiBat_MaNCC", value: data.topSupplier?.supplierId ?? "" },
            { category: "NhaCungCapNoiBat_TenNCC", value: data.topSupplier?.supplierName ?? "" },
            { category: "NhaCungCapNoiBat_SoLuongNhap", value: data.topSupplier?.importedQuantity ?? 0 },
            { category: "NhaCungCapNoiBat_GiaTriNhap", value: data.topSupplier?.importedValue ?? 0 },
            { category: "TonDauTong", value: data.stockMovement.totals.openingQuantity },
            { category: "NhapTrongKyTong", value: data.stockMovement.totals.importedQuantity },
            { category: "XuatTrongKyTong", value: data.stockMovement.totals.exportedQuantity },
            { category: "TonCuoiTong", value: data.stockMovement.totals.closingQuantity },
          ]),
          {
            name: "BienDongTonKho",
            columns: [
              { header: "MaVatTu", key: "partId", width: 12 },
              { header: "TenVatTu", key: "partName", width: 28 },
              { header: "DonViTinh", key: "unit", width: 14 },
              { header: "TonDau", key: "openingQuantity", width: 12, numFmt: INTEGER_FORMAT },
              { header: "NhapTrongKy", key: "importedQuantity", width: 14, numFmt: INTEGER_FORMAT },
              { header: "XuatTrongKy", key: "exportedQuantity", width: 14, numFmt: INTEGER_FORMAT },
              { header: "TonCuoi", key: "closingQuantity", width: 12, numFmt: INTEGER_FORMAT },
            ],
            rows: data.stockMovement.items,
          },
          {
            name: "VatTuSuDungNhieu",
            columns: [
              { header: "MaVatTu", key: "partId", width: 12 },
              { header: "TenVatTu", key: "partName", width: 28 },
              { header: "DonViTinh", key: "unit", width: 14 },
              { header: "SoLuongSuDung", key: "quantityUsed", width: 16, numFmt: INTEGER_FORMAT },
              { header: "TonHienTai", key: "currentStock", width: 14, numFmt: INTEGER_FORMAT },
            ],
            rows: data.mostUsedParts,
          },
          {
            name: "TonKhoThap",
            columns: [
              { header: "MaVatTu", key: "partId", width: 12 },
              { header: "TenVatTu", key: "partName", width: 28 },
              { header: "DonViTinh", key: "unit", width: 14 },
              { header: "TonHienTai", key: "currentStock", width: 14, numFmt: INTEGER_FORMAT },
              { header: "NguongCanhBao", key: "threshold", width: 16, numFmt: INTEGER_FORMAT },
            ],
            rows: data.lowStockParts,
          },
        ],
      }),
    };
  },

  exportRepairSummary: async (query) => {
    const data = await repairReportService.getRepairSummary(query);

    return {
      fileName: createReportFileName("repair-summary-report"),
      buffer: await createReportWorkbookBuffer({
        sheets: [
          buildSummarySheet("TongQuan", [
            { category: "TuNgay", value: query.from },
            { category: "DenNgay", value: query.to },
            { category: "Granularity", value: query.granularity },
            { category: "TongPhieuSua", value: data.timeseries.totalRepairOrders },
            { category: "TiepNhan", value: data.statusBreakdown.receiving },
            { category: "DangSua", value: data.statusBreakdown.inProgress },
            { category: "HoanTat", value: data.statusBreakdown.completed },
            { category: "Huy", value: data.statusBreakdown.cancelled },
            { category: "KyThuatVienNoiBat_MaNV", value: data.topTechnician?.technicianId ?? "" },
            { category: "KyThuatVienNoiBat_SoPhieu", value: data.topTechnician?.repairOrderCount ?? 0 },
          ]),
          {
            name: "XuHuongSuaChua",
            columns: [
              { header: "Ky", key: "label", width: 18 },
              { header: "SoPhieuSua", key: "repairOrderCount", width: 16, numFmt: INTEGER_FORMAT },
            ],
            rows: data.timeseries.items,
          },
        ],
      }),
    };
  },

  exportRevenueTimeseries: async (query) => {
    const data = await revenueReportService.getRevenueTimeseries(query);

    return {
      fileName: createReportFileName("revenue-timeseries-report"),
      buffer: await createReportWorkbookBuffer({
        sheets: [
          buildSummarySheet("TongQuan", [
            { category: "TuNgay", value: query.from },
            { category: "DenNgay", value: query.to },
            { category: "Granularity", value: query.granularity },
            { category: "TongDoanhThu", value: data.totalRevenue },
          ]),
          {
            name: "DoanhThuTheoKy",
            columns: [
              { header: "Ky", key: "label", width: 18 },
              { header: "DoanhThu", key: "revenue", width: 18, numFmt: CURRENCY_FORMAT },
            ],
            rows: data.items,
          },
        ],
      }),
    };
  },

  exportRevenueByCarBrand: async (query) => {
    const data = await revenueReportService.getRevenueByCarBrand(query);

    return {
      fileName: createReportFileName("revenue-by-car-brand-report"),
      buffer: await createReportWorkbookBuffer({
        sheets: [
          buildSummarySheet("TongQuan", [
            { category: "TuNgay", value: query.from },
            { category: "DenNgay", value: query.to },
            { category: "TongDoanhThu", value: data.totalRevenue },
          ]),
          {
            name: "TheoHieuXe",
            columns: [
              { header: "MaHieuXe", key: "carBrandId", width: 12 },
              { header: "TenHieuXe", key: "carBrandName", width: 24 },
              { header: "DoanhThu", key: "revenue", width: 18, numFmt: CURRENCY_FORMAT },
              { header: "TyTrong", key: "ratio", width: 12, numFmt: RATIO_FORMAT },
            ],
            rows: data.items.map((item) => ({ ...item, ratio: percentRatio(item.ratio) })),
          },
        ],
      }),
    };
  },

  exportRevenueByPart: async (query) => {
    const data = await revenueReportService.getRevenueByPart(query);

    return {
      fileName: createReportFileName("revenue-by-part-report"),
      buffer: await createReportWorkbookBuffer({
        sheets: [
          buildSummarySheet("TongQuan", [
            { category: "TuNgay", value: query.from },
            { category: "DenNgay", value: query.to },
            { category: "TongDoanhThu", value: data.totalRevenue },
          ]),
          {
            name: "TheoVatTu",
            columns: [
              { header: "MaVatTu", key: "partId", width: 12 },
              { header: "TenVatTu", key: "partName", width: 28 },
              { header: "DoanhThu", key: "revenue", width: 18, numFmt: CURRENCY_FORMAT },
              { header: "TyTrong", key: "ratio", width: 12, numFmt: RATIO_FORMAT },
            ],
            rows: data.items.map((item) => ({ ...item, ratio: percentRatio(item.ratio) })),
          },
        ],
      }),
    };
  },

  exportRevenueComparison: async (query) => {
    const data = await revenueReportService.getRevenueComparison(query);

    return {
      fileName: createReportFileName("revenue-comparison-report"),
      buffer: await createReportWorkbookBuffer({
        sheets: [
          buildSummarySheet("SoSanhDoanhThu", [
            { category: "KyHienTai_TuNgay", value: data.currentPeriod.from },
            { category: "KyHienTai_DenNgay", value: data.currentPeriod.to },
            { category: "KyHienTai_DoanhThu", value: data.currentPeriod.revenue },
            { category: "KyTruoc_TuNgay", value: data.previousPeriod.from },
            { category: "KyTruoc_DenNgay", value: data.previousPeriod.to },
            { category: "KyTruoc_DoanhThu", value: data.previousPeriod.revenue },
            { category: "CungKyNamTruoc_TuNgay", value: data.samePeriodLastYear.from },
            { category: "CungKyNamTruoc_DenNgay", value: data.samePeriodLastYear.to },
            { category: "CungKyNamTruoc_DoanhThu", value: data.samePeriodLastYear.revenue },
            { category: "DeltaKyTruoc", value: data.deltaPrevious },
            { category: "DeltaKyTruocPercent", value: data.deltaPreviousPercent },
            { category: "DeltaNamTruoc", value: data.deltaLastYear },
            { category: "DeltaNamTruocPercent", value: data.deltaLastYearPercent },
          ]),
        ],
      }),
    };
  },

  exportRevenueComposition: async (query) => {
    const data = await revenueReportService.getRevenueComposition(query);

    return {
      fileName: createReportFileName("revenue-composition-report"),
      buffer: await createReportWorkbookBuffer({
        sheets: [
          buildSummarySheet("TongQuan", [
            { category: "TuNgay", value: query.from },
            { category: "DenNgay", value: query.to },
          ]),
          ...data.groups.map((group) => ({
            name: group.label,
            columns: [
              { header: "Key", key: "key", width: 16 },
              { header: "TenNhom", key: "label", width: 28 },
              { header: "DoanhThu", key: "revenue", width: 18, numFmt: CURRENCY_FORMAT },
              { header: "TyTrong", key: "ratio", width: 12, numFmt: RATIO_FORMAT },
            ],
            rows: group.items.map((item) => ({
              ...item,
              ratio: percentRatio(item.ratio),
            })),
          })),
        ],
      }),
    };
  },

  exportAllReports: async (query) => {
    const baseRangeQuery = {
      from: query.from,
      to: query.to,
    };
    const rangeWithGranularity = {
      ...baseRangeQuery,
      granularity: query.granularity,
    };

    const [
      customerSummary,
      dashboardRevenueSummary,
      financeSummary,
      financeDebtorsByVehicle,
      financeDebtorsByCustomer,
      inventorySummary,
      repairSummary,
      revenueTimeseries,
      revenueByCarBrand,
      revenueByPart,
      revenueComparison,
      revenueComposition,
    ] = await Promise.all([
      customerReportService.getCustomerSummary(rangeWithGranularity),
      dashboardService.getRevenueSummary({}),
      financeReportService.getFinanceSummary(rangeWithGranularity),
      financeReportService.getFinanceDebtors({
        page: 1,
        limit: 10000,
        groupBy: "vehicle",
        search: "",
      }),
      financeReportService.getFinanceDebtors({
        page: 1,
        limit: 10000,
        groupBy: "customer",
        search: "",
      }),
      inventoryReportService.getInventorySummary(baseRangeQuery),
      repairReportService.getRepairSummary(rangeWithGranularity),
      revenueReportService.getRevenueTimeseries(rangeWithGranularity),
      revenueReportService.getRevenueByCarBrand(baseRangeQuery),
      revenueReportService.getRevenueByPart(baseRangeQuery),
      revenueReportService.getRevenueComparison(baseRangeQuery),
      revenueReportService.getRevenueComposition(baseRangeQuery),
    ]);

    return {
      fileName: createReportFileName("all-statistics-report"),
      buffer: await createReportWorkbookBuffer({
        sheets: [
          buildSummarySheet("TongHop", [
            { category: "TuNgay", value: query.from },
            { category: "DenNgay", value: query.to },
            { category: "Granularity", value: query.granularity },
            { category: "DoanhThuHomNay", value: dashboardRevenueSummary.summary.todayRevenue },
            { category: "DoanhThuTuanNay", value: dashboardRevenueSummary.summary.weekRevenue },
            { category: "DoanhThuThangNay", value: dashboardRevenueSummary.summary.monthRevenue },
            { category: "TongCongNo", value: financeSummary.totalOutstandingDebt },
            { category: "TongGiaTriTonKho", value: inventorySummary.currentInventoryValue.totalValue },
            { category: "TongPhieuSua", value: repairSummary.timeseries.totalRepairOrders },
            { category: "TongDoanhThuBaoCao", value: revenueTimeseries.totalRevenue },
          ]),
          buildSummarySheet("KhachHang_TongQuan", [
            { category: "TongKhachHangMoi", value: customerSummary.newCustomersTimeseries.totalNewCustomers },
            { category: "TopDoanhThu_MaKH", value: customerSummary.topRevenueCustomer?.customerId ?? "" },
            { category: "TopDoanhThu_TenChuXe", value: customerSummary.topRevenueCustomer?.customerName ?? "" },
            { category: "TopDoanhThu_GiaTri", value: customerSummary.topRevenueCustomer?.totalRevenue ?? 0 },
            { category: "TopCongNo_MaKH", value: customerSummary.topDebtCustomer?.customerId ?? "" },
            { category: "TopCongNo_TenChuXe", value: customerSummary.topDebtCustomer?.customerName ?? "" },
            { category: "TopCongNo_GiaTri", value: customerSummary.topDebtCustomer?.totalDebt ?? 0 },
          ]),
          {
            name: "KhachHang_Moi",
            columns: [
              { header: "Ky", key: "label", width: 18 },
              { header: "SoKhachHangMoi", key: "newCustomers", width: 18, numFmt: INTEGER_FORMAT },
            ],
            rows: customerSummary.newCustomersTimeseries.items,
          },
          {
            name: "Dashboard_CanhBao",
            columns: [
              { header: "Code", key: "code", width: 18 },
              { header: "MucDo", key: "severity", width: 14 },
              { header: "TieuDe", key: "title", width: 28 },
              { header: "NoiDung", key: "message", width: 60 },
            ],
            rows: dashboardRevenueSummary.alerts,
          },
          buildSummarySheet("TaiChinh_TongQuan", [
            { category: "TongCongNo", value: financeSummary.totalOutstandingDebt },
            { category: "TongDaThu", value: financeSummary.collectedAmountTimeseries.totalCollectedAmount },
            { category: "CongNoPhatSinhThangNay", value: financeSummary.newDebtInCurrentMonth },
          ]),
          {
            name: "TaiChinh_ThuTienTheoKy",
            columns: [
              { header: "Ky", key: "label", width: 18 },
              { header: "SoTienThu", key: "collectedAmount", width: 20, numFmt: CURRENCY_FORMAT },
            ],
            rows: financeSummary.collectedAmountTimeseries.items,
          },
          {
            name: "CongNo_TheoXe",
            columns: [
              { header: "MaXe", key: "vehicleId", width: 12 },
              { header: "BienSo", key: "licensePlate", width: 18 },
              { header: "MaKH", key: "customerId", width: 12 },
              { header: "TenChuXe", key: "customerName", width: 28 },
              { header: "DienThoai", key: "phoneNumber", width: 18 },
              { header: "CongNo", key: "outstandingDebt", width: 18, numFmt: CURRENCY_FORMAT },
            ],
            rows: financeDebtorsByVehicle.items,
          },
          {
            name: "CongNo_TheoKhach",
            columns: [
              { header: "MaKH", key: "customerId", width: 12 },
              { header: "TenChuXe", key: "customerName", width: 28 },
              { header: "DienThoai", key: "phoneNumber", width: 18 },
              { header: "SoXeNo", key: "vehicleCount", width: 12, numFmt: INTEGER_FORMAT },
              { header: "CongNo", key: "outstandingDebt", width: 18, numFmt: CURRENCY_FORMAT },
            ],
            rows: financeDebtorsByCustomer.items,
          },
          buildSummarySheet("Kho_TongQuan", [
            { category: "TongGiaTriTonKho", value: inventorySummary.currentInventoryValue.totalValue },
            { category: "TongSoLuongTon", value: inventorySummary.currentInventoryValue.totalQuantity },
            { category: "SoLuongVatTu", value: inventorySummary.currentInventoryValue.partCount },
            { category: "NCCNoiBat_MaNCC", value: inventorySummary.topSupplier?.supplierId ?? "" },
            { category: "NCCNoiBat_TenNCC", value: inventorySummary.topSupplier?.supplierName ?? "" },
          ]),
          {
            name: "Kho_BienDong",
            columns: [
              { header: "MaVatTu", key: "partId", width: 12 },
              { header: "TenVatTu", key: "partName", width: 28 },
              { header: "DonViTinh", key: "unit", width: 14 },
              { header: "TonDau", key: "openingQuantity", width: 12, numFmt: INTEGER_FORMAT },
              { header: "NhapTrongKy", key: "importedQuantity", width: 14, numFmt: INTEGER_FORMAT },
              { header: "XuatTrongKy", key: "exportedQuantity", width: 14, numFmt: INTEGER_FORMAT },
              { header: "TonCuoi", key: "closingQuantity", width: 12, numFmt: INTEGER_FORMAT },
            ],
            rows: inventorySummary.stockMovement.items,
          },
          {
            name: "Kho_SuDungNhieu",
            columns: [
              { header: "MaVatTu", key: "partId", width: 12 },
              { header: "TenVatTu", key: "partName", width: 28 },
              { header: "DonViTinh", key: "unit", width: 14 },
              { header: "SoLuongSuDung", key: "quantityUsed", width: 16, numFmt: INTEGER_FORMAT },
              { header: "TonHienTai", key: "currentStock", width: 14, numFmt: INTEGER_FORMAT },
            ],
            rows: inventorySummary.mostUsedParts,
          },
          {
            name: "Kho_TonThap",
            columns: [
              { header: "MaVatTu", key: "partId", width: 12 },
              { header: "TenVatTu", key: "partName", width: 28 },
              { header: "DonViTinh", key: "unit", width: 14 },
              { header: "TonHienTai", key: "currentStock", width: 14, numFmt: INTEGER_FORMAT },
              { header: "NguongCanhBao", key: "threshold", width: 16, numFmt: INTEGER_FORMAT },
            ],
            rows: inventorySummary.lowStockParts,
          },
          buildSummarySheet("SuaChua_TongQuan", [
            { category: "TongPhieuSua", value: repairSummary.timeseries.totalRepairOrders },
            { category: "TiepNhan", value: repairSummary.statusBreakdown.receiving },
            { category: "DangSua", value: repairSummary.statusBreakdown.inProgress },
            { category: "HoanTat", value: repairSummary.statusBreakdown.completed },
            { category: "Huy", value: repairSummary.statusBreakdown.cancelled },
            { category: "KTvNoiBat_MaNV", value: repairSummary.topTechnician?.technicianId ?? "" },
            { category: "KTvNoiBat_SoPhieu", value: repairSummary.topTechnician?.repairOrderCount ?? 0 },
          ]),
          {
            name: "SuaChua_TheoKy",
            columns: [
              { header: "Ky", key: "label", width: 18 },
              { header: "SoPhieuSua", key: "repairOrderCount", width: 16, numFmt: INTEGER_FORMAT },
            ],
            rows: repairSummary.timeseries.items,
          },
          buildSummarySheet("DoanhThu_TongQuan", [
            { category: "TongDoanhThu", value: revenueTimeseries.totalRevenue },
            { category: "KyHienTai_DoanhThu", value: revenueComparison.currentPeriod.revenue },
            { category: "KyTruoc_DoanhThu", value: revenueComparison.previousPeriod.revenue },
            { category: "CungKyNamTruoc_DoanhThu", value: revenueComparison.samePeriodLastYear.revenue },
            { category: "DeltaKyTruoc", value: revenueComparison.deltaPrevious },
            { category: "DeltaNamTruoc", value: revenueComparison.deltaLastYear },
          ]),
          {
            name: "DoanhThu_TheoKy",
            columns: [
              { header: "Ky", key: "label", width: 18 },
              { header: "DoanhThu", key: "revenue", width: 18, numFmt: CURRENCY_FORMAT },
            ],
            rows: revenueTimeseries.items,
          },
          {
            name: "DoanhThu_HieuXe",
            columns: [
              { header: "MaHieuXe", key: "carBrandId", width: 12 },
              { header: "TenHieuXe", key: "carBrandName", width: 24 },
              { header: "DoanhThu", key: "revenue", width: 18, numFmt: CURRENCY_FORMAT },
              { header: "TyTrong", key: "ratio", width: 12, numFmt: RATIO_FORMAT },
            ],
            rows: revenueByCarBrand.items.map((item) => ({ ...item, ratio: percentRatio(item.ratio) })),
          },
          {
            name: "DoanhThu_VatTu",
            columns: [
              { header: "MaVatTu", key: "partId", width: 12 },
              { header: "TenVatTu", key: "partName", width: 28 },
              { header: "DoanhThu", key: "revenue", width: 18, numFmt: CURRENCY_FORMAT },
              { header: "TyTrong", key: "ratio", width: 12, numFmt: RATIO_FORMAT },
            ],
            rows: revenueByPart.items.map((item) => ({ ...item, ratio: percentRatio(item.ratio) })),
          },
          buildSummarySheet("DoanhThu_SoSanh", [
            { category: "KyHienTai_TuNgay", value: revenueComparison.currentPeriod.from },
            { category: "KyHienTai_DenNgay", value: revenueComparison.currentPeriod.to },
            { category: "KyHienTai_DoanhThu", value: revenueComparison.currentPeriod.revenue },
            { category: "KyTruoc_TuNgay", value: revenueComparison.previousPeriod.from },
            { category: "KyTruoc_DenNgay", value: revenueComparison.previousPeriod.to },
            { category: "KyTruoc_DoanhThu", value: revenueComparison.previousPeriod.revenue },
            { category: "CungKyNamTruoc_TuNgay", value: revenueComparison.samePeriodLastYear.from },
            { category: "CungKyNamTruoc_DenNgay", value: revenueComparison.samePeriodLastYear.to },
            { category: "CungKyNamTruoc_DoanhThu", value: revenueComparison.samePeriodLastYear.revenue },
            { category: "DeltaKyTruocPercent", value: revenueComparison.deltaPreviousPercent },
            { category: "DeltaNamTruocPercent", value: revenueComparison.deltaLastYearPercent },
          ]),
          ...revenueComposition.groups.map((group) => ({
            name: `TyTrong_${group.key}`,
            columns: [
              { header: "Key", key: "key", width: 16 },
              { header: "TenNhom", key: "label", width: 28 },
              { header: "DoanhThu", key: "revenue", width: 18, numFmt: CURRENCY_FORMAT },
              { header: "TyTrong", key: "ratio", width: 12, numFmt: RATIO_FORMAT },
            ],
            rows: group.items.map((item) => ({
              ...item,
              ratio: percentRatio(item.ratio),
            })),
          })),
        ],
      }),
    };
  },
};

export default reportExportService;
