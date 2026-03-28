import Joi from "joi";

const dashboardSchema = {
  getRevenueSummary: {
    query: Joi.object({}).unknown(false),
  },
};

export default dashboardSchema;
