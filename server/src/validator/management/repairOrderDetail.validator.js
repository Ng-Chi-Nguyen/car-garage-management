import Joi from "joi";

import createCrudValidator from "../../shared/crud/crud.validatorFactory.js";

const REPAIR_ORDER_DETAIL_FILTER_FIELDS = {
  MaCTSC: { type: "number", positive: true },
  MaPhieuSC: { type: "number", positive: true },
  MaVatTu: { type: "number", positive: true },
  MaTienCong: { type: "number", positive: true },
  SoLuong: { type: "number", positive: true },
  DonGiaVatTu: { type: "decimal", min: 0 },
  DonGiaTienCong: { type: "decimal", min: 0 },
  ThanhTien: { type: "decimal", min: 0 },
};

const repairOrderDetailSchema = createCrudValidator({
  createBodySchema: Joi.object({
    MaPhieuSC: Joi.number().integer().positive().required(),
    MaVatTu: Joi.number().integer().positive().required(),
    MaTienCong: Joi.number().integer().positive().required(),
    SoLuong: Joi.number().integer().positive().required(),
    DonGiaVatTu: Joi.number().min(0).required(),
    DonGiaTienCong: Joi.number().min(0).required(),
  }).unknown(false),
  updateBodySchema: Joi.object({
    MaPhieuSC: Joi.number().integer().positive(),
    MaVatTu: Joi.number().integer().positive(),
    MaTienCong: Joi.number().integer().positive(),
    SoLuong: Joi.number().integer().positive(),
    DonGiaVatTu: Joi.number().min(0),
    DonGiaTienCong: Joi.number().min(0),
  })
    .min(1)
    .unknown(false),
  filterFields: REPAIR_ORDER_DETAIL_FILTER_FIELDS,
});

export default repairOrderDetailSchema;
