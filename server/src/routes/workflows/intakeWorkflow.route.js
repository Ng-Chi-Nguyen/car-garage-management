import intakeWorkflowController, { intakeWorkflowHistoryController } from "../../controllers/workflows/intakeWorkflow.controller.js";
import createWorkflowRoute from "../../shared/workflows/workflow.routeFactory.js";
import intakeWorkflowSchema from "../../validator/workflows/intakeWorkflow.validator.js";

const intakeWorkflowRoute = createWorkflowRoute({
  schema: intakeWorkflowSchema,
  controller: intakeWorkflowController,
});

intakeWorkflowRoute.get("/history", intakeWorkflowHistoryController);

export default intakeWorkflowRoute;
