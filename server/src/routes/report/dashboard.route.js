import express from "express";

import dashboardController from "../../controllers/report/dashboard.controller.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import dashboardSchema from "../../validator/report/dashboard.validator.js";

const createDashboardRoute = ({
  controller = dashboardController,
  schema = dashboardSchema,
} = {}) => {
  const router = express.Router();

  router.get(
    "/revenue-summary",
    validateRequest(schema.getRevenueSummary.query, "query"),
    controller.getRevenueSummary,
  );

  router.get(
    "/revenue-summary/export",
    validateRequest(schema.getRevenueSummary.query, "query"),
    controller.exportRevenueSummary,
  );

  return router;
};

const dashboardRoute = createDashboardRoute();

export { createDashboardRoute };
export default dashboardRoute;
