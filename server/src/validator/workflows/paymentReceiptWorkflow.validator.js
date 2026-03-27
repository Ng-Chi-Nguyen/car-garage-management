import Joi from "joi";

const PAYMENT_RECEIPT_PHUONG_THUC_THU_VALUES = ["TienMat", "ChuyenKhoan"];
const PAYMENT_RECEIPT_TRANG_THAI_VALUES = ["ChoXacNhan", "DaThu", "Huy"];

const paymentReceiptWorkflowSchema = {
  create: {
    body: Joi.object({
      paymentReceipt: Joi.object({
        MaXe: Joi.number().integer().positive().required(),
        MaNV: Joi.number().integer().positive().allow(null),
        NgayThu: Joi.date().required(),
        SoTienThu: Joi.number().positive().required(),
        PhuongThucThu: Joi.string().valid(...PAYMENT_RECEIPT_PHUONG_THUC_THU_VALUES),
        TrangThai: Joi.string().valid(...PAYMENT_RECEIPT_TRANG_THAI_VALUES).default("ChoXacNhan"),
        GhiChu: Joi.string().trim().max(255).allow(null, ""),
      }).required().unknown(false),
    }).unknown(false),
  },
};

export default paymentReceiptWorkflowSchema;
