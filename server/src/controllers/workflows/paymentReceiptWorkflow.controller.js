import paymentReceiptWorkflowService from "../../services/workflows/paymentReceiptWorkflow.service.js";
import createWorkflowController from "../../shared/workflows/workflow.controllerFactory.js";

const createPaymentReceiptWorkflowController = (service = paymentReceiptWorkflowService) => {
  return createWorkflowController({
    service,
    successMessage: "Tạo workflow phiếu thu tiền thành công.",
  });
};

const paymentReceiptWorkflowController = createPaymentReceiptWorkflowController();

export { createPaymentReceiptWorkflowController };
export default paymentReceiptWorkflowController;
