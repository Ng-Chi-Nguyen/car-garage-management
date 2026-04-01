import express from "express";

import financeReportController from "../../controllers/report/financeReport.controller.js";
import authMiddleware from "../../middleware/auth/auth.middleware.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import financeReportSchema from "../../validator/report/financeReport.validator.js";
import { createDashboardRateLimiter } from "./dashboard.access.js";

const managementRoles = ["Admin", "NhanVien"];
const financeReportRateLimiter = createDashboardRateLimiter({
  message: {
    success: false,
    message:
      "Bạn đang gửi quá nhiều yêu cầu đến báo cáo tài chính. Vui lòng thử lại sau.",
  },
});

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
    financeReportRateLimiter,
    mergedController.getFinanceSummary,
  );

  router.get(
    "/debtors",
    auth.requireAuth,
    auth.requireRoles(managementRoles),
    validateRequest(mergedSchema.getFinanceDebtors.query, "query"),
    financeReportRateLimiter,
    mergedController.getFinanceDebtors,
  );

  return router;
};

const financeReportRoute = createFinanceReportRoute();

export { createFinanceReportRoute };
export default financeReportRoute;
