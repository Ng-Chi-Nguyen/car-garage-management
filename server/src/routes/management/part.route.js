import partController from "../../controllers/management/part.controller.js";
import createCrudRoute from "../../shared/crud/crud.routeFactory.js";
import partSchema from "../../validator/management/part.validator.js";

const partRoute = createCrudRoute({
  schema: partSchema,
  controller: {
    create: partController.createPart,
    getAll: partController.getPartList,
    getById: partController.getPartById,
    update: partController.updatePart,
    remove: partController.deletePart,
  },
});

export default partRoute;
