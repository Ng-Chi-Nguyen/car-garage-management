import createCrudController from "../../shared/crud/crud.controllerFactory.js";
import stockReceiptService from "../../services/management/stockReceipt.service.js";

const crudController = createCrudController({
  service: {
    create: stockReceiptService.createStockReceipt,
    getAll: stockReceiptService.getStockReceiptList,
    getById: stockReceiptService.getStockReceiptById,
    update: stockReceiptService.updateStockReceipt,
    remove: stockReceiptService.deleteStockReceipt,
  },
  entityKey: "stockReceipt",
  messages: {
    createSuccess: "Tạo phiếu nhập kho thành công.",
    listSuccess: "Lấy danh sách phiếu nhập kho thành công.",
    detailSuccess: "Lấy thông tin phiếu nhập kho thành công.",
    updateSuccess: "Cập nhật phiếu nhập kho thành công.",
    deleteSuccess: "Xóa phiếu nhập kho thành công.",
    notFound: "Không tìm thấy phiếu nhập kho.",
    relatedData: "Không thể xóa phiếu nhập kho vì đang có dữ liệu liên quan.",
    duplicate: "Phiếu nhập kho đã tồn tại.",
  },
});

const stockReceiptController = {
  createStockReceipt: crudController.create,
  getStockReceiptList: crudController.getAll,
  getStockReceiptById: crudController.getById,
  updateStockReceipt: crudController.update,
  deleteStockReceipt: crudController.remove,
};

export default stockReceiptController;
