import Joi from "joi";

const passwordSchema = Joi.string().trim().min(8).max(255).required();

const withValidationPrefs = (schema) => schema.prefs({ abortEarly: false, allowUnknown: false });

const confirmPasswordSchema = (refKey) => Joi.string().valid(Joi.ref(refKey)).required().messages({
  "any.only": `${refKey === "MatKhau" ? "XacNhanMatKhau" : "XacNhanMatKhauMoi"} không khớp.`,
});

const authSchema = {
  register: {
    body: withValidationPrefs(Joi.object({
      Email: Joi.string().trim().email().max(100).required(),
      MatKhau: passwordSchema,
      XacNhanMatKhau: confirmPasswordSchema("MatKhau"),
      TenChuXe: Joi.string().trim().max(100).required(),
      DienThoai: Joi.string().trim().max(20).required(),
      DiaChi: Joi.string().trim().max(255).allow("").required(),
    }).unknown(false)),
  },
  login: {
    body: withValidationPrefs(Joi.object({
      Email: Joi.string().trim().email().max(100).required(),
      MatKhau: Joi.string().trim().required(),
    }).unknown(false)),
  },
  forgotPassword: {
    body: withValidationPrefs(Joi.object({
      Email: Joi.string().trim().email().max(100).required(),
    }).unknown(false)),
  },
  resetPassword: {
    body: withValidationPrefs(Joi.object({
      Token: Joi.string().trim().min(1).required(),
      MatKhauMoi: passwordSchema,
      XacNhanMatKhauMoi: confirmPasswordSchema("MatKhauMoi"),
    }).unknown(false)),
  },
  changePassword: {
    body: withValidationPrefs(Joi.object({
      MatKhauHienTai: Joi.string().trim().required(),
      MatKhauMoi: passwordSchema,
      XacNhanMatKhauMoi: confirmPasswordSchema("MatKhauMoi"),
    }).unknown(false)),
  },
};

export default authSchema;
