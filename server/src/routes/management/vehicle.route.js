import vehicleController from "../../controllers/management/vehicle.controller.js";
import createCrudRoute from "../../shared/crud/crud.routeFactory.js";
import vehicleSchema from "../../validator/management/vehicle.validator.js";

const vehicleRoute = createCrudRoute({
  schema: vehicleSchema,
  controller: {
    create: vehicleController.createVehicle,
    getAll: vehicleController.getVehicleList,
    getById: vehicleController.getVehicleById,
    update: vehicleController.updateVehicle,
    remove: vehicleController.deleteVehicle,
  },
});

export default vehicleRoute;
