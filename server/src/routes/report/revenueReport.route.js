import express from "express";

import revenueReportController from "../../controllers/report/revenueReport.controller.js";
import authMiddleware from "../../middleware/auth/auth.middleware.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import revenueReportSchema from "../../validator/report/revenueReport.validator.js";
import { createDashboardRateLimiter } from "./dashboard.access.js";

const managementRoles = ["Admin", "NhanVien"];
const revenueReportRateLimiter = createDashboardRateLimiter({
  message: {
    success: false,
    message:
      "Bạn đang gửi quá nhiều yêu cầu đến báo cáo doanh thu. Vui lòng thử lại sau.",
  },
});

const createRevenueReportRoute = ({
  auth = authMiddleware,
  controller = revenueReportController,
  schema = revenueReportSchema,
} = {}) => {
  const router = express.Router();
  const mergedController = {
    ...revenueReportController,
    ...controller,
  };
  const mergedSchema = {
    ...revenueReportSchema,
    ...schema,
  };

  router.get(
    "/timeseries",
    auth.requireAuth,
    auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getRevenueTimeseries.query, "query"),
    revenueReportRateLimiter,
    mergedController.getRevenueTimeseries,
  );

  router.get(
    "/by-car-brand",
    auth.requireAuth,
    auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getRevenueByCarBrand.query, "query"),
    revenueReportRateLimiter,
    mergedController.getRevenueByCarBrand,
  );

  router.get(
    "/by-part",
    auth.requireAuth,
    auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getRevenueByPart.query, "query"),
    revenueReportRateLimiter,
    mergedController.getRevenueByPart,
  );

  router.get(
    "/comparison",
    auth.requireAuth,
    auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getRevenueComparison.query, "query"),
    revenueReportRateLimiter,
    mergedController.getRevenueComparison,
  );

  router.get(
    "/composition",
    auth.requireAuth,
    auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getRevenueComposition.query, "query"),
    revenueReportRateLimiter,
    mergedController.getRevenueComposition,
  );

  return router;
};

const revenueReportRoute = createRevenueReportRoute();

export { createRevenueReportRoute };
export default revenueReportRoute;
