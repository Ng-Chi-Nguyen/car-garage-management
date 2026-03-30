import express from "express";

import customerReportController from "../../controllers/report/customerReport.controller.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import customerReportSchema from "../../validator/report/customerReport.validator.js";

const createCustomerReportRoute = ({
  controller = customerReportController,
  schema = customerReportSchema,
} = {}) => {
  const router = express.Router();
  const mergedController = {
    ...customerReportController,
    ...controller,
  };
  const mergedSchema = {
    ...customerReportSchema,
    ...schema,
  };

  router.get(
    "/summary",
    validateRequest(mergedSchema.getCustomerSummary.query, "query"),
    mergedController.getCustomerSummary,
  );

  return router;
};

const customerReportRoute = createCustomerReportRoute();

export { createCustomerReportRoute };
export default customerReportRoute;
