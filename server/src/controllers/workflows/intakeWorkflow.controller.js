import intakeWorkflowService from "../../services/workflows/intakeWorkflow.service.js";
import createWorkflowController from "../../shared/workflows/workflow.controllerFactory.js";

const createIntakeWorkflowController = (service = intakeWorkflowService) => {
  return createWorkflowController({
    service,
    successMessage: "Tạo workflow tiếp nhận xe thành công.",
  });
};

const intakeWorkflowHistoryController = async (req, res) => {
  const history = await intakeWorkflowService.fetchIntakeHistory();
  return res.status(200).json({ success: true, data: history });
};

const intakeWorkflowController = createIntakeWorkflowController();

export { createIntakeWorkflowController };
export { intakeWorkflowHistoryController };
export default intakeWorkflowController;
