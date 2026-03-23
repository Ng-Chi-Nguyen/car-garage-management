import stockReceiptController from "../../controllers/management/stockReceipt.controller.js";
import createCrudRoute from "../../shared/crud/crud.routeFactory.js";
import stockReceiptSchema from "../../validator/management/stockReceipt.validator.js";

const stockReceiptRoute = createCrudRoute({
  schema: stockReceiptSchema,
  controller: {
    create: stockReceiptController.createStockReceipt,
    getAll: stockReceiptController.getStockReceiptList,
    getById: stockReceiptController.getStockReceiptById,
    update: stockReceiptController.updateStockReceipt,
    remove: stockReceiptController.deleteStockReceipt,
  },
});

export default stockReceiptRoute;
