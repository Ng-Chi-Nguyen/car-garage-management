import express from "express";

import revenueReportController from "../../controllers/report/revenueReport.controller.js";
import authMiddleware from "../../middleware/auth/auth.middleware.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import revenueReportSchema from "../../validator/report/revenueReport.validator.js";

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
    // auth.requireAuth,
    // auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getRevenueTimeseries.query, "query"),
    mergedController.getRevenueTimeseries,
  );

  router.get(
    "/by-car-brand",
    // auth.requireAuth,
    // auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getRevenueByCarBrand.query, "query"),
    mergedController.getRevenueByCarBrand,
  );

  router.get(
    "/by-part",
    // auth.requireAuth,
    // auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getRevenueByPart.query, "query"),
    mergedController.getRevenueByPart,
  );

  router.get(
    "/comparison",
    // auth.requireAuth,
    // auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getRevenueComparison.query, "query"),
    mergedController.getRevenueComparison,
  );

  router.get(
    "/composition",
    // auth.requireAuth,
    // auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getRevenueComposition.query, "query"),
    mergedController.getRevenueComposition,
  );

  return router;
};

const revenueReportRoute = createRevenueReportRoute();

export { createRevenueReportRoute };
export default revenueReportRoute;
