import repairOrderController from "../../controllers/management/repairOrder.controller.js";
import createCrudRoute from "../../shared/crud/crud.routeFactory.js";
import repairOrderSchema from "../../validator/management/repairOrder.validator.js";

const repairOrderRoute = createCrudRoute({
  schema: repairOrderSchema,
  controller: {
    create: repairOrderController.createRepairOrder,
    getAll: repairOrderController.getRepairOrderList,
    getById: repairOrderController.getRepairOrderById,
    update: repairOrderController.updateRepairOrder,
    remove: repairOrderController.deleteRepairOrder,
  },
});

export default repairOrderRoute;
