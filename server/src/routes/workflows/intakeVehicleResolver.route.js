import express from "express";
import Joi from "joi";

import { validateRequest } from "../../middleware/validation.middleware.js";
import intakeVehicleResolverController from "../../controllers/workflows/intakeVehicleResolver.controller.js";

const intakeVehicleResolverRoute = express.Router();

const intakeVehicleResolverSchema = {
  resolveVehicleByPlate: {
    query: Joi.object({
      BienSo: Joi.string().trim().required(),
    }).unknown(false),
  },
};

intakeVehicleResolverRoute.get(
  "/",
  validateRequest(intakeVehicleResolverSchema.resolveVehicleByPlate.query, "query"),
  intakeVehicleResolverController.resolveVehicleByPlate,
);

export default intakeVehicleResolverRoute;
