import express from "express";

import masterDataXlsxController from "../../controllers/management/masterDataXlsx.controller.js";
import {
  createXlsxUploadMiddleware,
  requireXlsxFile,
} from "../../middleware/xlsx-upload.middleware.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import masterDataXlsxSchema from "../../validator/management/masterDataXlsx.validator.js";

const masterDataXlsxRoute = express.Router();

masterDataXlsxRoute.get(
  "/:entity/template",
  validateRequest(masterDataXlsxSchema.params, "params"),
  validateRequest(masterDataXlsxSchema.query, "query"),
  masterDataXlsxController.downloadTemplate,
);

masterDataXlsxRoute.get(
  "/:entity/export",
  validateRequest(masterDataXlsxSchema.params, "params"),
  validateRequest(masterDataXlsxSchema.query, "query"),
  masterDataXlsxController.exportData,
);

masterDataXlsxRoute.post(
  "/:entity/import",
  validateRequest(masterDataXlsxSchema.params, "params"),
  createXlsxUploadMiddleware("file"),
  requireXlsxFile,
  validateRequest(masterDataXlsxSchema.body, "body"),
  masterDataXlsxController.importData,
);

masterDataXlsxRoute.put(
  "/:entity/sync",
  validateRequest(masterDataXlsxSchema.params, "params"),
  createXlsxUploadMiddleware("file"),
  requireXlsxFile,
  validateRequest(masterDataXlsxSchema.body, "body"),
  masterDataXlsxController.syncData,
);

masterDataXlsxRoute.put(
  "/:entity/update",
  validateRequest(masterDataXlsxSchema.params, "params"),
  createXlsxUploadMiddleware("file"),
  requireXlsxFile,
  validateRequest(masterDataXlsxSchema.body, "body"),
  masterDataXlsxController.updateData,
);

export default masterDataXlsxRoute;
