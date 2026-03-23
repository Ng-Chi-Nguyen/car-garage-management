import laborFeeController from "../../controllers/management/laborFee.controller.js";
import createCrudRoute from "../../shared/crud/crud.routeFactory.js";
import laborFeeSchema from "../../validator/management/laborFee.validator.js";

const laborFeeRoute = createCrudRoute({
  schema: laborFeeSchema,
  controller: {
    create: laborFeeController.createLaborFee,
    getAll: laborFeeController.getLaborFeeList,
    getById: laborFeeController.getLaborFeeById,
    update: laborFeeController.updateLaborFee,
    remove: laborFeeController.deleteLaborFee,
  },
});

export default laborFeeRoute;
