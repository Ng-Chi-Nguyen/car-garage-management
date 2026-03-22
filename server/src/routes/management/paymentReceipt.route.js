import paymentReceiptController from "../../controllers/management/paymentReceipt.controller.js";
import createCrudRoute from "../../shared/crud/crud.routeFactory.js";
import paymentReceiptSchema from "../../validator/management/paymentReceipt.validator.js";

const paymentReceiptRoute = createCrudRoute({
  schema: paymentReceiptSchema,
  controller: {
    create: paymentReceiptController.createPaymentReceipt,
    getAll: paymentReceiptController.getPaymentReceiptList,
    getById: paymentReceiptController.getPaymentReceiptById,
    update: paymentReceiptController.updatePaymentReceipt,
    remove: paymentReceiptController.deletePaymentReceipt,
  },
});

export default paymentReceiptRoute;
