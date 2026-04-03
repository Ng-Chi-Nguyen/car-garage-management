import Joi from "joi";

const PERIOD_VALUES = ["today", "7days", "30days", "all"];
const STATUS_VALUES = ["all", "success", "warning", "error"];

const baseActivityFilterSchema = Joi.object({
  period: Joi.string().valid(...PERIOD_VALUES).default("today"),
  user: Joi.string().trim().allow("").default("all"),
  actionType: Joi.string().trim().allow("").default("all"),
  status: Joi.string().valid(...STATUS_VALUES).default("all"),
  search: Joi.string().trim().allow("").default(""),
  fromDate: Joi.date().iso().optional(),
  toDate: Joi.date().iso().optional(),
}).unknown(false);

const activitySchema = {
  getActivityLogs: {
    query: baseActivityFilterSchema
      .keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
      })
      .unknown(false),
  },
  getActivityStats: {
    query: baseActivityFilterSchema,
  },
};

export default activitySchema;
