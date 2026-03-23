import Joi from "joi";

import createCrudValidator from "../../shared/crud/crud.validatorFactory.js";

const STOCK_RECEIPT_FILTER_FIELDS = {
  MaPhieuNhap: { type: "number", positive: true },
  MaNCC: { type: "number", positive: true },
  NgayNhapFrom: { type: "dateFrom", targetField: "NgayNhap" },
  NgayNhapTo: { type: "dateTo", targetField: "NgayNhap" },
  TongTien: { type: "decimal", min: 0 },
};

const stockReceiptSchema = createCrudValidator({
  createBodySchema: Joi.object({
    MaNCC: Joi.number().integer().positive().required(),
    NgayNhap: Joi.date().required(),
  }).unknown(false),
  updateBodySchema: Joi.object({
    MaNCC: Joi.number().integer().positive(),
    NgayNhap: Joi.date(),
  })
    .min(1)
    .unknown(false),
  filterFields: STOCK_RECEIPT_FILTER_FIELDS,
});

export default stockReceiptSchema;
