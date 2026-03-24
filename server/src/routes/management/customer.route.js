import express from "express";

import customerController from "../../controllers/management/customer.controller.js";
import { validate, validateRequest } from "../../middleware/validation.middleware.js";
import { validateMultipartBody } from "../../middleware/multipart-body.middleware.js";
import { createUploadMiddleware } from "../../middleware/upload.middleware.js";
import customerSchema from "../../validator/management/customer.validator.js";

const customerRoute = express.Router();

customerRoute.post(
  "/",
  createUploadMiddleware("avatar"),
  validate(customerSchema.create.body),
  customerController.createCustomer,
);

customerRoute.get("/", validateRequest(customerSchema.getAll.query, "query"), customerController.getCustomerList);
customerRoute.get("/:id", validateRequest(customerSchema.getById.params, "params"), customerController.getCustomerById);

customerRoute.put(
  "/:id",
  validateRequest(customerSchema.update.params, "params"),
  createUploadMiddleware("avatar"),
  validateMultipartBody(customerSchema.update.body, { allowFileOnly: true }),
  customerController.updateCustomer,
);

customerRoute.delete("/:id", validateRequest(customerSchema.delete.params, "params"), customerController.deleteCustomer);

export default customerRoute;
