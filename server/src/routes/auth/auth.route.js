import express from "express";

import authController from "../../controllers/auth/auth.controller.js";
import authMiddleware from "../../middleware/auth/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import authSchema from "../../validator/auth/auth.validator.js";

const authRoute = express.Router();

authRoute.post("/register", validate(authSchema.register.body), authController.register);
authRoute.post("/login", validate(authSchema.login.body), authController.login);
authRoute.post(
  "/forgot-password",
  validate(authSchema.forgotPassword.body),
  authController.forgotPassword,
);
authRoute.post(
  "/reset-password",
  validate(authSchema.resetPassword.body),
  authController.resetPassword,
);
authRoute.post(
  "/change-password",
  authMiddleware.requireAuth,
  validate(authSchema.changePassword.body),
  authController.changePassword,
);

export default authRoute;
