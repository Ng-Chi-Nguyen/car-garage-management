import { Router } from "express";

import activityController from "../controllers/activity.controller.js";
import activitySchema from "../validator/activity.validator.js";
import { validateRequest } from "../middleware/validation.middleware.js";

const router = Router();

router.get(
  "/logs",
  validateRequest(activitySchema.getActivityLogs.query, "query"),
  activityController.getActivityLogs,
);
router.get(
  "/stats",
  validateRequest(activitySchema.getActivityStats.query, "query"),
  activityController.getActivityStats,
);

export default router;
