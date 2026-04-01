import express from "express";

import financeReportController from "../../controllers/report/financeReport.controller.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import financeReportSchema from "../../validator/report/financeReport.validator.js";

const createFinanceReportRoute = ({
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
    validateRequest(mergedSchema.getFinanceSummary.query, "query"),
    mergedController.getFinanceSummary,
  );

  router.get(
    "/summary/export",
    validateRequest(mergedSchema.getFinanceSummary.query, "query"),
    mergedController.exportFinanceSummary,
  );

  router.get(
    "/debtors",
    validateRequest(mergedSchema.getFinanceDebtors.query, "query"),
    mergedController.getFinanceDebtors,
  );

  router.get(
    "/debtors/export",
    validateRequest(mergedSchema.getFinanceDebtors.query, "query"),
    mergedController.exportFinanceDebtors,
  );

  return router;
};

const financeReportRoute = createFinanceReportRoute();

export { createFinanceReportRoute };
export default financeReportRoute;
