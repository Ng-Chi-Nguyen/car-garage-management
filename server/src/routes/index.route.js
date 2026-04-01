import authRoute from "./auth/auth.route.js";
import dashboardRoute from "./report/dashboard.route.js";
import customerReportRoute from "./report/customerReport.route.js";
import financeReportRoute from "./report/financeReport.route.js";
import inventoryReportRoute from "./report/inventoryReport.route.js";
import revenueReportRoute from "./report/revenueReport.route.js";
import repairReportRoute from "./report/repairReport.route.js";
import carBrandRoute from "./management/carBrand.route.js";
import customerRoute from "./management/customer.route.js";
import laborFeeRoute from "./management/laborFee.route.js";
import authMiddleware from "../middleware/auth/auth.middleware.js";
import partRoute from "./management/part.route.js";
import paymentReceiptRoute from "./management/paymentReceipt.route.js";
import repairOrderDetailRoute from "./management/repairOrderDetail.route.js";
import repairOrderRoute from "./management/repairOrder.route.js";
import stockReceiptDetailRoute from "./management/stockReceiptDetail.route.js";
import stockReceiptRoute from "./management/stockReceipt.route.js";
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

  // =========================
  // API KHÔNG cần đăng nhập
  // =========================
  app.use(`${apiPrefixV1}/auth`, authRoute);
  app.use(`${apiPrefixV1}/reports/customer-report`, customerReportRoute);
  app.use(`${apiPrefixV1}/reports/revenue`, revenueReportRoute);
  app.use(`${apiPrefixV1}/reports/inventory`, inventoryReportRoute);
  app.use(`${apiPrefixV1}/reports/repair-report`, repairReportRoute);
  app.use(`${apiPrefixV1}/customers`, customerRoute);
  app.use(`${apiPrefixV1}/car-brands`, carBrandRoute);
  app.use(`${apiPrefixV1}/vehicles`, vehicleRoute);
  app.use(`${apiPrefixV1}/repair-orders`, ...requireManagementAccess, repairOrderRoute);
  app.use(`${apiPrefixV1}/labor-fees`, laborFeeRoute);
  app.use(`${apiPrefixV1}/parts`, partRoute);
  app.use(`${apiPrefixV1}/repair-order-details`, repairOrderDetailRoute);
  app.use(`${apiPrefixV1}/suppliers`, supplierRoute);
  app.use(`${apiPrefixV1}/stock-receipts`, stockReceiptRoute);
  app.use(`${apiPrefixV1}/stock-receipt-details`, stockReceiptDetailRoute);
  app.use(`${apiPrefixV1}/payment-receipts`, ...requireManagementAccess, paymentReceiptRoute);
  app.use(`${apiPrefixV1}/reports/finance`, ...requireManagementAccess, financeReportRoute);
};

export default Routes;
