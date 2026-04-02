import test from "node:test";
import assert from "node:assert/strict";
import ExcelJS from "exceljs";

import customerReportService from "../src/services/report/customerReport.service.js";
import dashboardService from "../src/services/report/dashboard.service.js";
import financeReportService from "../src/services/report/financeReport.service.js";
import inventoryReportService from "../src/services/report/inventoryReport.service.js";
import reportExportService from "../src/services/report/reportExport.service.js";
import repairReportService from "../src/services/report/repairReport.service.js";
import revenueReportService from "../src/services/report/revenueReport.service.js";

test("reportExportService exportCustomerSummary tao workbook xlsx hop le", async () => {
  const originalGetCustomerSummary = customerReportService.getCustomerSummary;

  customerReportService.getCustomerSummary = async () => ({
    newCustomersTimeseries: {
      totalNewCustomers: 3,
      items: [
        { label: "2026-01", newCustomers: 2 },
        { label: "2026-02", newCustomers: 1 },
      ],
    },
    topRevenueCustomer: {
      customerId: 8,
      customerName: "Nguyen Van A",
      totalRevenue: 1500000,
    },
    topDebtCustomer: {
      customerId: 9,
      customerName: "Le Thi B",
      totalDebt: 500000,
    },
  });

  try {
    const reportFile = await reportExportService.exportCustomerSummary({
      from: "2026-01-01",
      to: "2026-02-28",
      granularity: "month",
    });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(reportFile.buffer);

    const summarySheet = workbook.getWorksheet("TongQuan");
    const timeseriesSheet = workbook.getWorksheet("KhachHangMoi");

    assert.equal(reportFile.fileName, "customer-summary-report.xlsx");
    assert.equal(summarySheet.getCell("A1").value, "ChiTieu");
    assert.equal(timeseriesSheet.getCell("A1").value, "Ky");
    assert.equal(timeseriesSheet.getCell("B2").value, 2);
  } finally {
    customerReportService.getCustomerSummary = originalGetCustomerSummary;
  }
});

test("reportExportService exportAllReports tao workbook tong hop nhieu sheet", async () => {
  const originals = {
    customerSummary: customerReportService.getCustomerSummary,
    dashboardSummary: dashboardService.getRevenueSummary,
    financeSummary: financeReportService.getFinanceSummary,
    financeDebtors: financeReportService.getFinanceDebtors,
    inventorySummary: inventoryReportService.getInventorySummary,
    repairSummary: repairReportService.getRepairSummary,
    revenueTimeseries: revenueReportService.getRevenueTimeseries,
    revenueByCarBrand: revenueReportService.getRevenueByCarBrand,
    revenueByPart: revenueReportService.getRevenueByPart,
    revenueComparison: revenueReportService.getRevenueComparison,
    revenueComposition: revenueReportService.getRevenueComposition,
  };

  customerReportService.getCustomerSummary = async () => ({
    newCustomersTimeseries: { totalNewCustomers: 2, items: [{ label: "2026-01", newCustomers: 2 }] },
    topRevenueCustomer: { customerId: 1, customerName: "A", totalRevenue: 1000 },
    topDebtCustomer: { customerId: 2, customerName: "B", totalDebt: 500 },
  });
  dashboardService.getRevenueSummary = async () => ({
    summary: {
      todayRevenue: 100,
      weekRevenue: 700,
      monthRevenue: 3000,
      todayReceivedVehicles: 5,
      activeRepairOrders: 3,
      totalCollectedAmount: 2000,
      totalOutstandingDebt: 900,
      lowStockPartsCount: 1,
    },
    alerts: [{ code: "LOW_STOCK", severity: "warning", title: "Ton kho thap", message: "Co 1 vat tu ton thap." }],
  });
  financeReportService.getFinanceSummary = async () => ({
    totalOutstandingDebt: 900,
    collectedAmountTimeseries: { totalCollectedAmount: 2000, items: [{ label: "2026-01", collectedAmount: 2000 }] },
    newDebtInCurrentMonth: 300,
  });
  financeReportService.getFinanceDebtors = async ({ groupBy }) => ({
    items: groupBy === "customer"
      ? [{ customerId: 2, customerName: "B", phoneNumber: "0909", vehicleCount: 1, outstandingDebt: 500 }]
      : [{ vehicleId: 10, licensePlate: "51A-99999", customerId: 2, customerName: "B", phoneNumber: "0909", outstandingDebt: 500 }],
    pagination: { page: 1, limit: 10000, totalItems: 1, totalPages: 1 },
  });
  inventoryReportService.getInventorySummary = async () => ({
    stockMovement: { totals: { openingQuantity: 10, importedQuantity: 5, exportedQuantity: 2, closingQuantity: 13 }, items: [] },
    mostUsedParts: [],
    lowStockParts: [],
    currentInventoryValue: { totalValue: 12345, totalQuantity: 13, partCount: 4 },
    topSupplier: { supplierId: 6, supplierName: "NCC A", importedQuantity: 5, importedValue: 1000 },
  });
  repairReportService.getRepairSummary = async () => ({
    timeseries: { totalRepairOrders: 7, items: [{ label: "2026-01", repairOrderCount: 7 }] },
    statusBreakdown: { receiving: 1, inProgress: 2, completed: 3, cancelled: 1 },
    topTechnician: { technicianId: 4, repairOrderCount: 3 },
  });
  revenueReportService.getRevenueTimeseries = async () => ({
    totalRevenue: 5000,
    items: [{ label: "2026-01", revenue: 5000 }],
  });
  revenueReportService.getRevenueByCarBrand = async () => ({
    totalRevenue: 5000,
    items: [{ carBrandId: 1, carBrandName: "Toyota", revenue: 5000, ratio: 1 }],
  });
  revenueReportService.getRevenueByPart = async () => ({
    totalRevenue: 2000,
    items: [{ partId: 3, partName: "Loc gio", revenue: 2000, ratio: 1 }],
  });
  revenueReportService.getRevenueComparison = async () => ({
    currentPeriod: { from: "2026-01-01", to: "2026-01-31", revenue: 5000 },
    previousPeriod: { from: "2025-12-01", to: "2025-12-31", revenue: 3000 },
    samePeriodLastYear: { from: "2025-01-01", to: "2025-01-31", revenue: 2500 },
    deltaPrevious: 2000,
    deltaPreviousPercent: 0.6667,
    deltaLastYear: 2500,
    deltaLastYearPercent: 1,
  });
  revenueReportService.getRevenueComposition = async () => ({
    groups: [
      { key: "carBrand", label: "Hieu xe", items: [{ key: 1, label: "Toyota", revenue: 5000, ratio: 1 }] },
    ],
  });

  try {
    const reportFile = await reportExportService.exportAllReports({
      from: "2026-01-01",
      to: "2026-01-31",
      granularity: "month",
    });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(reportFile.buffer);

    assert.equal(reportFile.fileName, "all-statistics-report.xlsx");
    assert.ok(workbook.getWorksheet("TongHop"));
    assert.ok(workbook.getWorksheet("KhachHang_Moi"));
    assert.ok(workbook.getWorksheet("TaiChinh_ThuTienTheoKy"));
    assert.ok(workbook.getWorksheet("DoanhThu_TheoKy"));
  } finally {
    customerReportService.getCustomerSummary = originals.customerSummary;
    dashboardService.getRevenueSummary = originals.dashboardSummary;
    financeReportService.getFinanceSummary = originals.financeSummary;
    financeReportService.getFinanceDebtors = originals.financeDebtors;
    inventoryReportService.getInventorySummary = originals.inventorySummary;
    repairReportService.getRepairSummary = originals.repairSummary;
    revenueReportService.getRevenueTimeseries = originals.revenueTimeseries;
    revenueReportService.getRevenueByCarBrand = originals.revenueByCarBrand;
    revenueReportService.getRevenueByPart = originals.revenueByPart;
    revenueReportService.getRevenueComparison = originals.revenueComparison;
    revenueReportService.getRevenueComposition = originals.revenueComposition;
  }
});
