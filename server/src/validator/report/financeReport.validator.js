import Joi from "joi";

import { createReportRangeQuerySchema } from "./reportDateRange.validator.helpers.js";

const financeReportSchema = {
  getFinanceSummary: {
    query: createReportRangeQuerySchema({ includeGranularity: true }),
  },
  getFinanceDebtors: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).default(10),
      search: Joi.string().trim().allow("").optional(),
      groupBy: Joi.string().valid("vehicle", "customer").default("vehicle"),
    }).unknown(false),
  },
};

export default financeReportSchema;
