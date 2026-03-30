import { createReportRangeQuerySchema } from "./reportDateRange.validator.helpers.js";

const rangeQuerySchema = createReportRangeQuerySchema({ includeGranularity: true });

const repairReportSchema = {
  getRepairSummary: {
    query: rangeQuerySchema,
  },
};

export default repairReportSchema;
