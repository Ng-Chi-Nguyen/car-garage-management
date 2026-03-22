import carBrandController from "../../controllers/management/carBrand.controller.js";
import createCrudRoute from "../../shared/crud/crud.routeFactory.js";
import carBrandSchema from "../../validator/management/carBrand.validator.js";

const carBrandRoute = createCrudRoute({
  schema: carBrandSchema,
  controller: {
    create: carBrandController.createCarBrand,
    getAll: carBrandController.getCarBrandList,
    getById: carBrandController.getCarBrandById,
    update: carBrandController.updateCarBrand,
    remove: carBrandController.deleteCarBrand,
  },
});

export default carBrandRoute;
