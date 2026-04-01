import express from "express";

import reportExportController from "../../controllers/report/reportExport.controller.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import reportExportSchema from "../../validator/report/reportExport.validator.js";

const createReportExportRoute = ({
  controller = reportExportController,
  schema = reportExportSchema,
} = {}) => {
  const router = express.Router();

  router.get(
    "/export",
    validateRequest(schema.exportAllReports.query, "query"),
    controller.exportAllReports,
  );

  return router;
};

const reportExportRoute = createReportExportRoute();

export { createReportExportRoute };
export default reportExportRoute;
