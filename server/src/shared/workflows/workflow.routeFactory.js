import express from "express";

import { validate } from "../../middleware/validation.middleware.js";

const createWorkflowRoute = ({ schema, controller }) => {
  const router = express.Router();

  router.post("/", validate(schema.create.body), controller.create);

  return router;
};

export default createWorkflowRoute;
