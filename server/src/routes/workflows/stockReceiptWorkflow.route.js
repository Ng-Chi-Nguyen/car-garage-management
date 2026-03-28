import stockReceiptWorkflowController from "../../controllers/workflows/stockReceiptWorkflow.controller.js";
import createWorkflowRoute from "../../shared/workflows/workflow.routeFactory.js";
import stockReceiptWorkflowSchema from "../../validator/workflows/stockReceiptWorkflow.validator.js";

const stockReceiptWorkflowRoute = createWorkflowRoute({
  schema: stockReceiptWorkflowSchema,
  controller: stockReceiptWorkflowController,
});

export default stockReceiptWorkflowRoute;
