import paymentReceiptWorkflowController from "../../controllers/workflows/paymentReceiptWorkflow.controller.js";
import createWorkflowRoute from "../../shared/workflows/workflow.routeFactory.js";
import paymentReceiptWorkflowSchema from "../../validator/workflows/paymentReceiptWorkflow.validator.js";

const paymentReceiptWorkflowRoute = createWorkflowRoute({
  schema: paymentReceiptWorkflowSchema,
  controller: paymentReceiptWorkflowController,
});

export default paymentReceiptWorkflowRoute;
