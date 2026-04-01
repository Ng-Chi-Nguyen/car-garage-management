import authRoute from "./auth/auth.route.js";
import { dashboardAccessMiddlewares } from "./report/dashboard.access.js";
import dashboardRoute from "./report/dashboard.route.js";
import customerReportRoute from "./report/customerReport.route.js";
import financeReportRoute from "./report/financeReport.route.js";
import inventoryReportRoute from "./report/inventoryReport.route.js";
import repairReportRoute from "./report/repairReport.route.js";
import reportExportRoute from "./report/reportExport.route.js";
import revenueReportRoute from "./report/revenueReport.route.js";
import carBrandRoute from "./management/carBrand.route.js";
import customerRoute from "./management/customer.route.js";
import laborFeeRoute from "./management/laborFee.route.js";
import masterDataXlsxRoute from "./management/masterDataXlsx.route.js";
import authMiddleware from "../middleware/auth/auth.middleware.js";
import partRoute from "./management/part.route.js";
import paymentReceiptRoute from "./management/paymentReceipt.route.js";
import paymentReceiptWorkflowRoute from "./workflows/paymentReceiptWorkflow.route.js";
import repairOrderDetailRoute from "./management/repairOrderDetail.route.js";
import repairOrderRoute from "./management/repairOrder.route.js";
import repairOrderWorkflowRoute from "./workflows/repairOrderWorkflow.route.js";
import stockReceiptDetailRoute from "./management/stockReceiptDetail.route.js";
import stockReceiptRoute from "./management/stockReceipt.route.js";
import stockReceiptWorkflowRoute from "./workflows/stockReceiptWorkflow.route.js";
import supplierRoute from "./management/supplier.route.js";
import vehicleRoute from "./management/vehicle.route.js";

const apiPrefixV1 = "/api/v1";

const Routes = (app) => {
  // Nhóm middleware bắt buộc phải đăng nhập và có role Admin hoặc NhanVien
  const requireManagementAccess = [
    authMiddleware.requireAuth,
    authMiddleware.requireRoles(["Admin", "NhanVien"]),
  ];

  // =========================
  // API dashboard nội bộ cần đăng nhập + rate limit
  // =========================
  app.use(`${apiPrefixV1}/dashboard`, dashboardRoute);
  // app.use(`${apiPrefixV1}/dashboard`, ...dashboardAccessMiddlewares, dashboardRoute);

  // =========================
  // API KHÔNG cần đăng nhập
  // =========================
  app.use(`${apiPrefixV1}/auth`, authRoute);
  app.use(`${apiPrefixV1}/reports`, reportExportRoute);
  app.use(`${apiPrefixV1}/reports/customer-report`, customerReportRoute);
  // app.use(`${apiPrefixV1}/reports/customer-report`, ...requireManagementAccess, customerReportRoute);
  app.use(`${apiPrefixV1}/reports/revenue`, revenueReportRoute);
  app.use(`${apiPrefixV1}/reports/inventory`, inventoryReportRoute);
  app.use(`${apiPrefixV1}/reports/repair-report`, repairReportRoute);
  app.use(`${apiPrefixV1}/workflows/repair-orders`, repairOrderWorkflowRoute);
  app.use(`${apiPrefixV1}/workflows/stock-receipts`, stockReceiptWorkflowRoute);
  app.use(`${apiPrefixV1}/workflows/payment-receipts`, paymentReceiptWorkflowRoute);
  app.use(`${apiPrefixV1}/master-data/xlsx`, masterDataXlsxRoute);
  app.use(`${apiPrefixV1}/customers`, customerRoute);
  app.use(`${apiPrefixV1}/car-brands`, carBrandRoute);
  app.use(`${apiPrefixV1}/vehicles`, vehicleRoute);
  app.use(`${apiPrefixV1}/repair-orders`, repairOrderRoute);
  app.use(`${apiPrefixV1}/labor-fees`, laborFeeRoute);
  app.use(`${apiPrefixV1}/parts`, partRoute);
  app.use(`${apiPrefixV1}/repair-order-details`, repairOrderDetailRoute);
  app.use(`${apiPrefixV1}/suppliers`, supplierRoute);
  app.use(`${apiPrefixV1}/stock-receipts`, stockReceiptRoute);
  app.use(`${apiPrefixV1}/stock-receipt-details`, stockReceiptDetailRoute);
  app.use(`${apiPrefixV1}/payment-receipts`, paymentReceiptRoute);
  app.use(`${apiPrefixV1}/reports/finance`, financeReportRoute);
  // =========================
  // API CẦN đăng nhập
  // =========================
  // app.use(`${apiPrefixV1}/reports/finance`, ...requireManagementAccess, financeReportRoute);
  // app.use(`${apiPrefixV1}/auth`, authRoute);
  // app.use(`${apiPrefixV1}/dashboard`, ...requireManagementAccess, dashboardRoute);
  // app.use(`${apiPrefixV1}/reports/revenue`, ...requireManagementAccess, revenueReportRoute);
  // app.use(`${apiPrefixV1}/reports/repair-report`, ...requireManagementAccess, repairReportRoute);
  // app.use(`${apiPrefixV1}/workflows/repair-orders`,...requireManagementAccess,repairOrderWorkflowRoute,);
  // app.use(`${apiPrefixV1}/workflows/stock-receipts`,...requireManagementAccess,stockReceiptWorkflowRoute,);
  // app.use(`${apiPrefixV1}/workflows/payment-receipts`,...requireManagementAccess,paymentReceiptWorkflowRoute,);
  // app.use(`${apiPrefixV1}/customers`, ...requireManagementAccess, customerRoute);
  // app.use(`${apiPrefixV1}/car-brands`, ...requireManagementAccess, carBrandRoute);
  // app.use(`${apiPrefixV1}/vehicles`, ...requireManagementAccess, vehicleRoute);
  // app.use(`${apiPrefixV1}/repair-orders`, ...requireManagementAccess, repairOrderRoute);
  // app.use(`${apiPrefixV1}/labor-fees`, ...requireManagementAccess, laborFeeRoute);
  // app.use(`${apiPrefixV1}/parts`, ...requireManagementAccess, partRoute);
  // app.use(`${apiPrefixV1}/repair-order-details`,...requireManagementAccess,repairOrderDetailRoute,);
  // app.use(`${apiPrefixV1}/suppliers`, ...requireManagementAccess, supplierRoute);
  // app.use(`${apiPrefixV1}/stock-receipts`, ...requireManagementAccess, stockReceiptRoute);
  // app.use(`${apiPrefixV1}/stock-receipt-details`,...requireManagementAccess,stockReceiptDetailRoute,);
  // app.use(`${apiPrefixV1}/payment-receipts`,...requireManagementAccess,paymentReceiptRoute,);
};

export default Routes;
