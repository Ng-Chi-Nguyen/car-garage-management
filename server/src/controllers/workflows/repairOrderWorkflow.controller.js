import repairOrderWorkflowService from "../../services/workflows/repairOrderWorkflow.service.js";
import createWorkflowController from "../../shared/workflows/workflow.controllerFactory.js";

const createRepairOrderWorkflowController = (service = repairOrderWorkflowService) => {
  return createWorkflowController({
    service,
    successMessage: "Tạo workflow phiếu sửa chữa thành công.",
  });
};

const repairOrderWorkflowController = createRepairOrderWorkflowController();

export { createRepairOrderWorkflowController };
export default repairOrderWorkflowController;
