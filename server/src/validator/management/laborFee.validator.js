import Joi from "joi";

import createCrudValidator from "../../shared/crud/crud.validatorFactory.js";

const LABOR_FEE_FILTER_FIELDS = {
  MaTienCong: { type: "number" },
  NoiDung: { type: "string" },
  DonGia: { type: "decimal" },
};

const laborFeeSchema = createCrudValidator({
  createBodySchema: Joi.object({
    NoiDung: Joi.string().trim().max(255).required(),
    DonGia: Joi.number().min(0).required(),
  }).unknown(false),
  updateBodySchema: Joi.object({
    NoiDung: Joi.string().trim().max(255),
    DonGia: Joi.number().min(0),
  })
    .min(1)
    .unknown(false),
  filterFields: LABOR_FEE_FILTER_FIELDS,
});

export default laborFeeSchema;
