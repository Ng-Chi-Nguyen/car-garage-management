import stockReceiptDetailController from "../../controllers/management/stockReceiptDetail.controller.js";
import createCrudRoute from "../../shared/crud/crud.routeFactory.js";
import stockReceiptDetailSchema from "../../validator/management/stockReceiptDetail.validator.js";

const stockReceiptDetailRoute = createCrudRoute({
  schema: stockReceiptDetailSchema,
  controller: {
    create: stockReceiptDetailController.createStockReceiptDetail,
    getAll: stockReceiptDetailController.getStockReceiptDetailList,
    getById: stockReceiptDetailController.getStockReceiptDetailById,
    update: stockReceiptDetailController.updateStockReceiptDetail,
    remove: stockReceiptDetailController.deleteStockReceiptDetail,
  },
});

export default stockReceiptDetailRoute;
