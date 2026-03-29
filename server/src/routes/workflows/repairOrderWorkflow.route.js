import repairOrderWorkflowController from "../../controllers/workflows/repairOrderWorkflow.controller.js";
import createWorkflowRoute from "../../shared/workflows/workflow.routeFactory.js";
import repairOrderWorkflowSchema from "../../validator/workflows/repairOrderWorkflow.validator.js";

const repairOrderWorkflowRoute = createWorkflowRoute({
  schema: repairOrderWorkflowSchema,
  controller: repairOrderWorkflowController,
});

export default repairOrderWorkflowRoute;
