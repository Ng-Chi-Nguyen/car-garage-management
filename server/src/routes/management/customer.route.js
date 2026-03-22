import customerController from "../../controllers/management/customer.controller.js";
import createCrudRoute from "../../shared/crud/crud.routeFactory.js";
import customerSchema from "../../validator/management/customer.validator.js";

const customerRoute = createCrudRoute({
  schema: customerSchema,
  controller: {
    create: customerController.createCustomer,
    getAll: customerController.getCustomerList,
    getById: customerController.getCustomerById,
    update: customerController.updateCustomer,
    remove: customerController.deleteCustomer,
  },
});

export default customerRoute;
