import { Router } from "express";

import settingsController from "../controllers/settings.controller.js";
import settingsSchema from "../validator/settings.validator.js";
import { validateRequest } from "../middleware/validation.middleware.js";

const router = Router();

router.get("/parameters", settingsController.getSystemParameters);
router.put("/parameters", validateRequest(settingsSchema.update, "body"), settingsController.updateSystemParameters);
router.get("/service-prices", settingsController.getServicePrices);
router.get("/car-brands", settingsController.getCarBrands);

export default router;
