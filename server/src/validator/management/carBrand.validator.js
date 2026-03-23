import Joi from "joi";

import createCrudValidator from "../../shared/crud/crud.validatorFactory.js";

const CAR_BRAND_FILTER_FIELDS = {
  MaHieuXe: { type: "number" },
  TenHieuXe: { type: "string" },
};

const carBrandSchema = createCrudValidator({
  createBodySchema: Joi.object({
    TenHieuXe: Joi.string().trim().max(100).required(),
  }).unknown(false),
  updateBodySchema: Joi.object({
    TenHieuXe: Joi.string().trim().max(100),
  })
    .min(1)
    .unknown(false),
  filterFields: CAR_BRAND_FILTER_FIELDS,
});

export default carBrandSchema;
