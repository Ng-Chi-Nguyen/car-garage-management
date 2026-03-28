import Joi from "joi";

const REPAIR_ORDER_TRANG_THAI_VALUES = ["TiepNhan", "DangSua", "HoanTat"];

const repairOrderWorkflowSchema = {
  create: {
    body: Joi.object({
      repairOrder: Joi.object({
        MaXe: Joi.number().integer().positive().required(),
        MaNV: Joi.number().integer().positive().allow(null),
        NgaySC: Joi.date().required(),
        TrangThai: Joi.string().valid(...REPAIR_ORDER_TRANG_THAI_VALUES).default("TiepNhan"),
        NoiDungLoi: Joi.string().trim().max(255).allow(null, ""),
        GhiChu: Joi.string().trim().max(255).allow(null, ""),
      }).required().unknown(false),
      details: Joi.array()
        .items(
          Joi.object({
            MaVatTu: Joi.number().integer().positive().required(),
            MaTienCong: Joi.number().integer().positive().required(),
            SoLuong: Joi.number().integer().positive().required(),
            DonGiaVatTu: Joi.number().min(0).required(),
            DonGiaTienCong: Joi.number().min(0).required(),
          }).unknown(false),
        )
        .min(1)
        .required(),
    }).unknown(false),
  },
};

export default repairOrderWorkflowSchema;
