import { Router } from "express";

import adminUsersController from "../../controllers/adminUsers.controller.js";
import adminUsersSchema from "../../validator/adminUsers.validator.js";
import { validateRequest } from "../../middleware/validation.middleware.js";

const router = Router();

router.get("/", validateRequest(adminUsersSchema.getAll.query, "query"), adminUsersController.getAdminUsers);
router.put(
  "/:id",
  validateRequest(adminUsersSchema.update.params, "params"),
  validateRequest(adminUsersSchema.update.body, "body"),
  adminUsersController.updateAdminUser,
);

router.post(
  "/:id/reset-password",
  validateRequest(adminUsersSchema.resetPassword.params, "params"),
  validateRequest(adminUsersSchema.resetPassword.body, "body"),
  adminUsersController.resetAdminUserPassword,
);

export default router;
