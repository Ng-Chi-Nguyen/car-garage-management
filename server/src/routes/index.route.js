import authRoute from "./auth/auth.route.js";
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

const Routes = (app) => {
  const apiPrefixV1 = "/api/v1";

  // login true
  const requireManagementAccess = [
    authMiddleware.requireAuth,
    authMiddleware.requireRoles(["Admin", "NhanVien"]),
  ];

  // app.use(`${apiPrefixV1}/auth`, authRoute);
  // app.use(`${apiPrefixV1}/customers`, ...requireManagementAccess, customerRoute); // KHACH_HANG
  // app.use(`${apiPrefixV1}/car-brands`, ...requireManagementAccess, carBrandRoute); // HIEU_XE
  // app.use(`${apiPrefixV1}/vehicles`, ...requireManagementAccess, vehicleRoute); // XE
  // app.use(`${apiPrefixV1}/repair-orders`, ...requireManagementAccess, repairOrderRoute); // PHIEU_SUA_CHUA
  // app.use(`${apiPrefixV1}/labor-fees`, ...requireManagementAccess, laborFeeRoute); // TIEN_CONG
  // app.use(`${apiPrefixV1}/parts`, ...requireManagementAccess, partRoute); // VAT_TU
  // app.use(`${apiPrefixV1}/repair-order-details`, ...requireManagementAccess, repairOrderDetailRoute); // CT_PHIEU_SUA_CHUA
  // app.use(`${apiPrefixV1}/suppliers`, ...requireManagementAccess, supplierRoute); // NHA_CUNG_CAP
  // app.use(`${apiPrefixV1}/stock-receipts`, ...requireManagementAccess, stockReceiptRoute); // PHIEU_NHAP_KHO
  // app.use(`${apiPrefixV1}/stock-receipt-details`, ...requireManagementAccess, stockReceiptDetailRoute); // CT_PHIEU_NHAP
  // app.use(`${apiPrefixV1}/payment-receipts`, ...requireManagementAccess, paymentReceiptRoute); // PHIEU_THU_TIEN


  // Login false

  app.use(`${apiPrefixV1}/auth`, authRoute);
  app.use(`${apiPrefixV1}/customers`, customerRoute); // KHACH_HANG
  app.use(`${apiPrefixV1}/car-brands`, carBrandRoute); // HIEU_XE
  app.use(`${apiPrefixV1}/vehicles`, vehicleRoute); // XE
  app.use(`${apiPrefixV1}/repair-orders`, repairOrderRoute); // PHIEU_SUA_CHUA
  app.use(`${apiPrefixV1}/labor-fees`, laborFeeRoute); // TIEN_CONG
  app.use(`${apiPrefixV1}/parts`, partRoute); // VAT_TU
  app.use(`${apiPrefixV1}/repair-order-details`, repairOrderDetailRoute); // CT_PHIEU_SUA_CHUA
  app.use(`${apiPrefixV1}/suppliers`, supplierRoute); // NHA_CUNG_CAP
  app.use(`${apiPrefixV1}/stock-receipts`, stockReceiptRoute); // PHIEU_NHAP_KHO
  app.use(`${apiPrefixV1}/stock-receipt-details`, stockReceiptDetailRoute); // CT_PHIEU_NHAP
  app.use(`${apiPrefixV1}/payment-receipts`, paymentReceiptRoute); // PHIEU_THU_TIEN

};

export default Routes;
