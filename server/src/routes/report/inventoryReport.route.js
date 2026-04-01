import express from "express";

import inventoryReportController from "../../controllers/report/inventoryReport.controller.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import inventoryReportSchema from "../../validator/report/inventoryReport.validator.js";

const createInventoryReportRoute = ({
  controller = inventoryReportController,
  schema = inventoryReportSchema,
} = {}) => {
  const router = express.Router();
  const mergedController = {
    ...inventoryReportController,
    ...controller,
  };
  const mergedSchema = {
    ...inventoryReportSchema,
    ...schema,
  };

  router.get(
    "/summary",
    validateRequest(mergedSchema.getInventorySummary.query, "query"),
    mergedController.getInventorySummary,
  );

  router.get(
    "/summary/export",
    validateRequest(mergedSchema.getInventorySummary.query, "query"),
    mergedController.exportInventorySummary,
  );

  return router;
};

const inventoryReportRoute = createInventoryReportRoute();

export { createInventoryReportRoute };
export default inventoryReportRoute;
