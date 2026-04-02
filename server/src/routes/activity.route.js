import { Router } from "express";

import activityController from "../controllers/activity.controller.js";

const router = Router();

router.get("/logs", activityController.getActivityLogs);
router.get("/stats", activityController.getActivityStats);

export default router;
