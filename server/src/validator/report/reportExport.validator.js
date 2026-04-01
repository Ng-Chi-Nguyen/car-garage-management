import { createReportRangeQuerySchema } from "./reportDateRange.validator.helpers.js";

const reportExportSchema = {
  exportAllReports: {
    query: createReportRangeQuerySchema({ includeGranularity: true }),
  },
};

export default reportExportSchema;
