import Joi from "joi";

const isValidCalendarDate = (dateString) => {
  const [year, month, day] = String(dateString).split("-").map(Number);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return false;
  }

  const candidate = new Date(Date.UTC(year, month - 1, day));

  return candidate.getUTCFullYear() === year
    && candidate.getUTCMonth() + 1 === month
    && candidate.getUTCDate() === day;
};

const dateStringSchema = Joi.string()
  .pattern(/^\d{4}-\d{2}-\d{2}$/)
  .custom((value, helpers) => {
    if (!isValidCalendarDate(value)) {
      return helpers.error("date.invalidCalendar");
    }

    return value;
  })
  .messages({
    "date.invalidCalendar": 'Ngày phải là lịch hợp lệ theo định dạng YYYY-MM-DD.',
  })
  .required();

const rangeQuerySchema = Joi.object({
  from: dateStringSchema,
  to: dateStringSchema,
})
  .custom((value, helpers) => {
    if (value.from > value.to) {
      return helpers.error("date.range");
    }

    return value;
  })
  .messages({
    "date.range": '"from" không được lớn hơn "to".',
  })
  .unknown(false);

const revenueReportSchema = {
  getRevenueTimeseries: {
    query: rangeQuerySchema.keys({
      granularity: Joi.string().valid("day", "month", "year").required(),
    }),
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
