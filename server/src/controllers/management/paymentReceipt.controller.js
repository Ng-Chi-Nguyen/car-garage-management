import createCrudController from "../../shared/crud/crud.controllerFactory.js";
import paymentReceiptService from "../../services/management/paymentReceipt.service.js";

const crudController = createCrudController({
  service: {
    create: paymentReceiptService.createPaymentReceipt,
    getAll: paymentReceiptService.getPaymentReceiptList,
    getById: paymentReceiptService.getPaymentReceiptById,
    update: paymentReceiptService.updatePaymentReceipt,
    remove: paymentReceiptService.deletePaymentReceipt,
  },
  entityKey: "paymentReceipt",
  messages: {
    createSuccess: "Tạo phiếu thu tiền thành công.",
    listSuccess: "Lấy danh sách phiếu thu tiền thành công.",
    detailSuccess: "Lấy thông tin phiếu thu tiền thành công.",
    updateSuccess: "Cập nhật phiếu thu tiền thành công.",
    deleteSuccess: "Xóa phiếu thu tiền thành công.",
    notFound: "Không tìm thấy phiếu thu tiền.",
    relatedData: "Không thể xóa phiếu thu tiền vì đang có dữ liệu liên quan.",
    duplicate: "Phiếu thu tiền đã tồn tại.",
  },
});

const paymentReceiptController = {
  createPaymentReceipt: crudController.create,
  getPaymentReceiptList: crudController.getAll,
  getPaymentReceiptById: crudController.getById,
  updatePaymentReceipt: crudController.update,
  deletePaymentReceipt: crudController.remove,
};

export default paymentReceiptController;
