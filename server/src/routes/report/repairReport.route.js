import express from "express";

import repairReportController from "../../controllers/report/repairReport.controller.js";
import authMiddleware from "../../middleware/auth/auth.middleware.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import repairReportSchema from "../../validator/report/repairReport.validator.js";

const managementRoles = ["Admin", "NhanVien"];

const createRepairReportRoute = ({
  auth = authMiddleware,
  controller = repairReportController,
  schema = repairReportSchema,
} = {}) => {
  const router = express.Router();
  const mergedController = {
    ...repairReportController,
    ...controller,
  };
  const mergedSchema = {
    ...repairReportSchema,
    ...schema,
  };

  router.get(
    "/summary",
    // auth.requireAuth,
    // auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getRepairSummary.query, "query"),
    mergedController.getRepairSummary,
  );

  return router;
};

const repairReportRoute = createRepairReportRoute();

export { createRepairReportRoute };
export default repairReportRoute;
