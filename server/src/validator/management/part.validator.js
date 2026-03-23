import Joi from "joi";

import createCrudValidator from "../../shared/crud/crud.validatorFactory.js";

const PART_FILTER_FIELDS = {
  MaVatTu: { type: "number", positive: true },
  TenVatTu: { type: "string" },
  DonViTinh: { type: "string" },
  SoLuongTon: { type: "number", min: 0 },
  GiaVon: { type: "decimal", min: 0 },
  DonGiaBan: { type: "decimal", min: 0 },
  MaNCC: { type: "number", positive: true },
};

const partSchema = createCrudValidator({
  createBodySchema: Joi.object({
    TenVatTu: Joi.string().trim().max(255).required(),
    DonViTinh: Joi.string().trim().max(50).required(),
    GiaVon: Joi.number().min(0).required(),
    DonGiaBan: Joi.number().min(0).required(),
    MaNCC: Joi.number().integer().positive().allow(null),
  }).unknown(false),
  updateBodySchema: Joi.object({
    TenVatTu: Joi.string().trim().max(255),
    DonViTinh: Joi.string().trim().max(50),
    GiaVon: Joi.number().min(0),
    DonGiaBan: Joi.number().min(0),
    MaNCC: Joi.number().integer().positive().allow(null),
  })
    .min(1)
    .unknown(false),
  filterFields: PART_FILTER_FIELDS,
});

export default partSchema;
