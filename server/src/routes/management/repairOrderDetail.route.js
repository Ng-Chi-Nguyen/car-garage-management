import repairOrderDetailController from "../../controllers/management/repairOrderDetail.controller.js";
import createCrudRoute from "../../shared/crud/crud.routeFactory.js";
import repairOrderDetailSchema from "../../validator/management/repairOrderDetail.validator.js";

const repairOrderDetailRoute = createCrudRoute({
  schema: repairOrderDetailSchema,
  controller: {
    create: repairOrderDetailController.createRepairOrderDetail,
    getAll: repairOrderDetailController.getRepairOrderDetailList,
    getById: repairOrderDetailController.getRepairOrderDetailById,
    update: repairOrderDetailController.updateRepairOrderDetail,
    remove: repairOrderDetailController.deleteRepairOrderDetail,
  },
});

export default repairOrderDetailRoute;
