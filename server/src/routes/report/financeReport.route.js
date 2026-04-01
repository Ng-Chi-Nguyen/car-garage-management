import express from "express";

import financeReportController from "../../controllers/report/financeReport.controller.js";
import authMiddleware from "../../middleware/auth/auth.middleware.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import financeReportSchema from "../../validator/report/financeReport.validator.js";

const managementRoles = ["Admin", "NhanVien"];

const createFinanceReportRoute = ({
  auth = authMiddleware,
  controller = financeReportController,
  schema = financeReportSchema,
} = {}) => {
  const router = express.Router();
  const mergedController = {
    ...financeReportController,
    ...controller,
  };
  const mergedSchema = {
    ...financeReportSchema,
    ...schema,
  };

  router.get(
    "/summary",
    auth.requireAuth,
    auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getFinanceSummary.query, "query"),
    mergedController.getFinanceSummary,
  );

  router.get(
    "/debtors",
    auth.requireAuth,
    auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getFinanceDebtors.query, "query"),
    mergedController.getFinanceDebtors,
  );

  return router;
};

const financeReportRoute = createFinanceReportRoute();

export { createFinanceReportRoute };
export default financeReportRoute;
