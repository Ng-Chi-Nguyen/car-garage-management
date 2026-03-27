import Joi from "joi";

const stockReceiptWorkflowSchema = {
  create: {
    body: Joi.object({
      stockReceipt: Joi.object({
        MaNCC: Joi.number().integer().positive().required(),
        NgayNhap: Joi.date().required(),
      }).required().unknown(false),
      details: Joi.array()
        .items(
          Joi.object({
            MaVatTu: Joi.number().integer().positive().required(),
            SoLuong: Joi.number().integer().positive().required(),
            DonGiaNhap: Joi.number().min(0).required(),
          }).unknown(false),
        )
        .min(1)
        .required(),
    }).unknown(false),
  },
};

export default stockReceiptWorkflowSchema;
