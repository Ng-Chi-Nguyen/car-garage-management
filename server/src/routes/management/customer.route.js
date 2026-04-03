import express from "express";

import customerController from "../../controllers/management/customer.controller.js";
import { validate, validateRequest } from "../../middleware/validation.middleware.js";
import { validateMultipartBody } from "../../middleware/multipart-body.middleware.js";
import { createUploadMiddleware } from "../../middleware/upload.middleware.js";

const passthrough = (value) => ({ error: undefined, value });

const defaultCustomerSchema = {
  create: { body: { validate: passthrough } },
  getAll: { query: { validate: passthrough } },
  getById: { params: { validate: passthrough } },
  update: { params: { validate: passthrough }, body: { validate: passthrough } },
  delete: { params: { validate: passthrough } },
  stats: { query: { validate: passthrough } },
};

const loadCustomerSchema = async () => {
  try {
    const module = await import("../../validator/management/customer.validator.js");
    return module.default;
  } catch {
    return defaultCustomerSchema;
  }
};

const customerSchema = await loadCustomerSchema();

const createCustomerRoute = ({ controller = customerController, schema = customerSchema } = {}) => {
  const router = express.Router();
  const mergedController = {
    ...customerController,
    ...controller,
  };
  const mergedSchema = {
    ...defaultCustomerSchema,
    ...schema,
  };

  router.post(
    "/",
    createUploadMiddleware("avatar"),
    validate(mergedSchema.create.body),
    mergedController.createCustomer,
  );

  router.get("/", validateRequest(mergedSchema.getAll.query, "query"), mergedController.getCustomerList);
  router.get("/stats", validateRequest(mergedSchema.stats.query, "query"), mergedController.getCustomerStats);
  router.get("/:id", validateRequest(mergedSchema.getById.params, "params"), mergedController.getCustomerById);

  router.put(
    "/:id",
    validateRequest(mergedSchema.update.params, "params"),
    createUploadMiddleware("avatar"),
    validateMultipartBody(mergedSchema.update.body, { allowFileOnly: true }),
    mergedController.updateCustomer,
  );

  router.delete("/:id", validateRequest(mergedSchema.delete.params, "params"), mergedController.deleteCustomer);

  return router;
};

const customerRoute = createCustomerRoute();

export { createCustomerRoute };
export default customerRoute;
