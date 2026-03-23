import Joi from "joi";

import createCrudValidator from "../../shared/crud/crud.validatorFactory.js";

const STOCK_RECEIPT_DETAIL_FILTER_FIELDS = {
  MaCTPN: { type: "number", positive: true },
  MaPhieuNhap: { type: "number", positive: true },
  MaVatTu: { type: "number", positive: true },
  SoLuong: { type: "number", positive: true },
  DonGiaNhap: { type: "decimal", min: 0 },
  ThanhTien: { type: "decimal", min: 0 },
};

const stockReceiptDetailSchema = createCrudValidator({
  createBodySchema: Joi.object({
    MaPhieuNhap: Joi.number().integer().positive().required(),
    MaVatTu: Joi.number().integer().positive().required(),
    SoLuong: Joi.number().integer().positive().required(),
    DonGiaNhap: Joi.number().min(0).required(),
  }).unknown(false),
  updateBodySchema: Joi.object({
    MaPhieuNhap: Joi.number().integer().positive(),
    MaVatTu: Joi.number().integer().positive(),
    SoLuong: Joi.number().integer().positive(),
    DonGiaNhap: Joi.number().min(0),
  })
    .min(1)
    .unknown(false),
  filterFields: STOCK_RECEIPT_DETAIL_FILTER_FIELDS,
});

export default stockReceiptDetailSchema;
