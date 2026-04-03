import createWorkflowController from "../../shared/workflows/workflow.controllerFactory.js";
import intakeVehicleResolverService from "../../services/workflows/intakeVehicleResolver.service.js";

const createIntakeVehicleResolverController = (service = intakeVehicleResolverService) => {
  const workflowController = createWorkflowController({
    service,
    successMessage: "Tạo workflow tiếp nhận xe thành công.",
  });

  return {
    create: workflowController.create,
    resolveVehicleByPlate: async (req, res) => {
      try {
        const data = await service.resolveVehicleByPlate(req.validatedQuery ?? req.query);
        return res.status(200).json({ success: true, data });
      } catch (error) {
        return res.status(error?.status || 500).json({
          success: false,
          message: error?.message || "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.",
        });
      }
    },
  };
};

const intakeVehicleResolverController = createIntakeVehicleResolverController();

export { createIntakeVehicleResolverController };
export default intakeVehicleResolverController;
