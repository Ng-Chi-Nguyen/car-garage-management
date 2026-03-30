import { createReportRangeQuerySchema } from "./reportDateRange.validator.helpers.js";

const rangeQuerySchema = createReportRangeQuerySchema();

const revenueReportSchema = {
  getRevenueTimeseries: {
    query: createReportRangeQuerySchema({ includeGranularity: true }),
  },
  getRevenueByCarBrand: {
    query: rangeQuerySchema,
  },
  getRevenueByPart: {
    query: rangeQuerySchema,
  },
  getRevenueComparison: {
    query: rangeQuerySchema,
  },
  getRevenueComposition: {
    query: rangeQuerySchema,
  },
};

export default revenueReportSchema;
