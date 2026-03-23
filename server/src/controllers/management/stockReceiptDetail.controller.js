import createCrudController from "../../shared/crud/crud.controllerFactory.js";
import stockReceiptDetailService from "../../services/management/stockReceiptDetail.service.js";

const crudController = createCrudController({
  service: {
    create: stockReceiptDetailService.createStockReceiptDetail,
    getAll: stockReceiptDetailService.getStockReceiptDetailList,
    getById: stockReceiptDetailService.getStockReceiptDetailById,
    update: stockReceiptDetailService.updateStockReceiptDetail,
    remove: stockReceiptDetailService.deleteStockReceiptDetail,
  },
  entityKey: "stockReceiptDetail",
  messages: {
    createSuccess: "Tạo chi tiết phiếu nhập thành công.",
    listSuccess: "Lấy danh sách chi tiết phiếu nhập thành công.",
    detailSuccess: "Lấy thông tin chi tiết phiếu nhập thành công.",
    updateSuccess: "Cập nhật chi tiết phiếu nhập thành công.",
    deleteSuccess: "Xóa chi tiết phiếu nhập thành công.",
    notFound: "Không tìm thấy chi tiết phiếu nhập.",
    relatedData: "Không thể xóa chi tiết phiếu nhập vì đang có dữ liệu liên quan.",
    duplicate: "Chi tiết phiếu nhập đã tồn tại.",
  },
});

const stockReceiptDetailController = {
  createStockReceiptDetail: crudController.create,
  getStockReceiptDetailList: crudController.getAll,
  getStockReceiptDetailById: crudController.getById,
  updateStockReceiptDetail: crudController.update,
  deleteStockReceiptDetail: crudController.remove,
};

export default stockReceiptDetailController;
