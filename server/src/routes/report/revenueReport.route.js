import express from "express";

import revenueReportController from "../../controllers/report/revenueReport.controller.js";
import authMiddleware from "../../middleware/auth/auth.middleware.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import revenueReportSchema from "../../validator/report/revenueReport.validator.js";
import { createDashboardRateLimiter } from "./dashboard.access.js";

const managementRoles = ["Admin", "NhanVien"];

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
    createDashboardRateLimiter({
      message: {
        success: false,
        message:
          "Bạn đang gửi quá nhiều yêu cầu đến báo cáo doanh thu. Vui lòng thử lại sau.",
      },
    }),
    auth.requireAuth,
    auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getRevenueTimeseries.query, "query"),
    mergedController.getRevenueTimeseries,
  );

  router.get(
    "/timeseries/export",
    createDashboardRateLimiter({
      message: {
        success: false,
        message:
          "Bạn đang gửi quá nhiều yêu cầu đến báo cáo doanh thu. Vui lòng thử lại sau.",
      },
    }),
    auth.requireAuth,
    auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getRevenueTimeseries.query, "query"),
    mergedController.exportRevenueTimeseries,
  );

  router.get(
    "/by-car-brand",
    createDashboardRateLimiter({
      message: {
        success: false,
        message:
          "Bạn đang gửi quá nhiều yêu cầu đến báo cáo doanh thu. Vui lòng thử lại sau.",
      },
    }),
    auth.requireAuth,
    auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getRevenueByCarBrand.query, "query"),
    mergedController.getRevenueByCarBrand,
  );

  router.get(
    "/by-car-brand/export",
    createDashboardRateLimiter({
      message: {
        success: false,
        message:
          "Bạn đang gửi quá nhiều yêu cầu đến báo cáo doanh thu. Vui lòng thử lại sau.",
      },
    }),
    auth.requireAuth,
    auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getRevenueByCarBrand.query, "query"),
    mergedController.exportRevenueByCarBrand,
  );

  router.get(
    "/by-part",
    createDashboardRateLimiter({
      message: {
        success: false,
        message:
          "Bạn đang gửi quá nhiều yêu cầu đến báo cáo doanh thu. Vui lòng thử lại sau.",
      },
    }),
    auth.requireAuth,
    auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getRevenueByPart.query, "query"),
    mergedController.getRevenueByPart,
  );

  router.get(
    "/by-part/export",
    createDashboardRateLimiter({
      message: {
        success: false,
        message:
          "Bạn đang gửi quá nhiều yêu cầu đến báo cáo doanh thu. Vui lòng thử lại sau.",
      },
    }),
    auth.requireAuth,
    auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getRevenueByPart.query, "query"),
    mergedController.exportRevenueByPart,
  );

  router.get(
    "/comparison",
    createDashboardRateLimiter({
      message: {
        success: false,
        message:
          "Bạn đang gửi quá nhiều yêu cầu đến báo cáo doanh thu. Vui lòng thử lại sau.",
      },
    }),
    auth.requireAuth,
    auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getRevenueComparison.query, "query"),
    mergedController.getRevenueComparison,
  );

  router.get(
    "/comparison/export",
    createDashboardRateLimiter({
      message: {
        success: false,
        message:
          "Bạn đang gửi quá nhiều yêu cầu đến báo cáo doanh thu. Vui lòng thử lại sau.",
      },
    }),
    auth.requireAuth,
    auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getRevenueComparison.query, "query"),
    mergedController.exportRevenueComparison,
  );

  router.get(
    "/composition",
    createDashboardRateLimiter({
      message: {
        success: false,
        message:
          "Bạn đang gửi quá nhiều yêu cầu đến báo cáo doanh thu. Vui lòng thử lại sau.",
      },
    }),
    auth.requireAuth,
    auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getRevenueComposition.query, "query"),
    mergedController.getRevenueComposition,
  );

  router.get(
    "/composition/export",
    createDashboardRateLimiter({
      message: {
        success: false,
        message:
          "Bạn đang gửi quá nhiều yêu cầu đến báo cáo doanh thu. Vui lòng thử lại sau.",
      },
    }),
    auth.requireAuth,
    auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getRevenueComposition.query, "query"),
    mergedController.exportRevenueComposition,
  );

  return router;
};

const revenueReportRoute = createRevenueReportRoute();

export { createRevenueReportRoute };
export default revenueReportRoute;
