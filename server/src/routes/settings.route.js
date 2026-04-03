import { Router } from "express";
import rateLimit from "express-rate-limit";

import authMiddleware from "../middleware/auth/auth.middleware.js";
import settingsController from "../controllers/settings.controller.js";
import settingsSchema from "../validator/settings.validator.js";
import { validateRequest } from "../middleware/validation.middleware.js";

const router = Router();
const managementRoles = ["Admin", "NhanVien"];
const adminRoles = ["Admin"];
const defaultSettingsRateLimitMessage =
  "Bạn đang gửi quá nhiều yêu cầu đến cài đặt. Vui lòng thử lại sau.";

const resolveSettingsRateLimitMax = () => {
  const configuredMax = Number(process.env.SETTINGS_RATE_LIMIT_MAX);

  if (Number.isInteger(configuredMax) && configuredMax > 0) {
    return configuredMax;
  }

  return 120;
};

router.use(
  rateLimit({
    windowMs: 60_000,
    max: resolveSettingsRateLimitMax(),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: defaultSettingsRateLimitMessage,
    },
  }),
);

router.get("/parameters", authMiddleware.requireRoles(managementRoles), settingsController.getSystemParameters);
router.put(
  "/parameters",
  authMiddleware.requireRoles(adminRoles),
  validateRequest(settingsSchema.update, "body"),
  settingsController.updateSystemParameters,
);
router.get("/service-prices", authMiddleware.requireRoles(managementRoles), settingsController.getServicePrices);
router.post(
  "/service-prices",
  authMiddleware.requireRoles(adminRoles),
  validateRequest(settingsSchema.createServicePrice.body, "body"),
  settingsController.createServicePrice,
);
router.put(
  "/service-prices/:id",
  authMiddleware.requireRoles(adminRoles),
  validateRequest(settingsSchema.updateServicePrice.params, "params"),
  validateRequest(settingsSchema.updateServicePrice.body, "body"),
  settingsController.updateServicePrice,
);
router.delete(
  "/service-prices/:id",
  authMiddleware.requireRoles(adminRoles),
  validateRequest(settingsSchema.deleteServicePrice.params, "params"),
  settingsController.deleteServicePrice,
);
router.get("/car-brands", authMiddleware.requireRoles(managementRoles), settingsController.getCarBrands);

export default router;
