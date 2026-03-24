import express from "express";

import carBrandController from "../../controllers/management/carBrand.controller.js";
import { validate, validateRequest } from "../../middleware/validation.middleware.js";
import { validateMultipartBody } from "../../middleware/multipart-body.middleware.js";
import { createUploadMiddleware } from "../../middleware/upload.middleware.js";
import carBrandSchema from "../../validator/management/carBrand.validator.js";

const carBrandRoute = express.Router();

carBrandRoute.post(
  "/",
  createUploadMiddleware("logo"),
  validate(carBrandSchema.create.body),
  carBrandController.createCarBrand,
);

carBrandRoute.get("/", validateRequest(carBrandSchema.getAll.query, "query"), carBrandController.getCarBrandList);
carBrandRoute.get("/:id", validateRequest(carBrandSchema.getById.params, "params"), carBrandController.getCarBrandById);

carBrandRoute.put(
  "/:id",
  validateRequest(carBrandSchema.update.params, "params"),
  createUploadMiddleware("logo"),
  validateMultipartBody(carBrandSchema.update.body, { allowFileOnly: true }),
  carBrandController.updateCarBrand,
);

carBrandRoute.delete("/:id", validateRequest(carBrandSchema.delete.params, "params"), carBrandController.deleteCarBrand);

export default carBrandRoute;
