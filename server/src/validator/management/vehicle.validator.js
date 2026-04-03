import Joi from "joi";

import createCrudValidator from "../../shared/crud/crud.validatorFactory.js";

const VEHICLE_FILTER_FIELDS = {
  MaXe: { type: "number", positive: true },
  BienSo: { type: "string" },
  MauXe: { type: "string" },
  MaHieuXe: { type: "number", positive: true },
  MaKH: { type: "number", positive: true },
  TienNoHienTai: { type: "decimal", min: 0 },
};

const vehicleSchema = createCrudValidator({
  createBodySchema: Joi.object({
    BienSo: Joi.string().trim().max(20).required(),
    MauXe: Joi.string().trim().max(50).allow(null),
    MaHieuXe: Joi.number().integer().positive().required(),
    MaKH: Joi.number().integer().positive().required(),
  }).unknown(false),
  updateBodySchema: Joi.object({
    BienSo: Joi.string().trim().max(20),
    MauXe: Joi.string().trim().max(50).allow(null),
    MaHieuXe: Joi.number().integer().positive(),
    MaKH: Joi.number().integer().positive(),
  })
    .min(1)
    .unknown(false),
  filterFields: VEHICLE_FILTER_FIELDS,
});

export default vehicleSchema;
