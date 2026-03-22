import supplierController from "../../controllers/management/supplier.controller.js";
import createCrudRoute from "../../shared/crud/crud.routeFactory.js";
import supplierSchema from "../../validator/management/supplier.validator.js";

const supplierRoute = createCrudRoute({
  schema: supplierSchema,
  controller: {
    create: supplierController.createSupplier,
    getAll: supplierController.getSupplierList,
    getById: supplierController.getSupplierById,
    update: supplierController.updateSupplier,
    remove: supplierController.deleteSupplier,
  },
});

export default supplierRoute;
