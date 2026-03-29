import { createReportRangeQuerySchema } from "./reportDateRange.validator.helpers.js";

const customerReportSchema = {
  getCustomerSummary: {
    query: createReportRangeQuerySchema({ includeGranularity: true }),
  },
};

export default customerReportSchema;
