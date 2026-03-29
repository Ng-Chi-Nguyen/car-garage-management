import stockReceiptWorkflowService from "../../services/workflows/stockReceiptWorkflow.service.js";
import createWorkflowController from "../../shared/workflows/workflow.controllerFactory.js";

const createStockReceiptWorkflowController = (service = stockReceiptWorkflowService) => {
  return createWorkflowController({
    service,
    successMessage: "Tạo workflow phiếu nhập kho thành công.",
  });
};

const stockReceiptWorkflowController = createStockReceiptWorkflowController();

export { createStockReceiptWorkflowController };
export default stockReceiptWorkflowController;
