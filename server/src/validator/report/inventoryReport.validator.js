import { createReportRangeQuerySchema } from "./reportDateRange.validator.helpers.js";

const inventoryReportSchema = {
  getInventorySummary: {
    query: createReportRangeQuerySchema(),
  },
};

export default inventoryReportSchema;
