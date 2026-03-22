import createCrudController from "../../shared/crud/crud.controllerFactory.js";
import repairOrderService from "../../services/management/repairOrder.service.js";

const crudController = createCrudController({
  service: {
    create: repairOrderService.createRepairOrder,
    getAll: repairOrderService.getRepairOrderList,
    getById: repairOrderService.getRepairOrderById,
    update: repairOrderService.updateRepairOrder,
    remove: repairOrderService.deleteRepairOrder,
  },
  entityKey: "repairOrder",
  messages: {
    createSuccess: "Tạo phiếu sửa chữa thành công.",
    listSuccess: "Lấy danh sách phiếu sửa chữa thành công.",
    detailSuccess: "Lấy thông tin phiếu sửa chữa thành công.",
    updateSuccess: "Cập nhật phiếu sửa chữa thành công.",
    deleteSuccess: "Xóa phiếu sửa chữa thành công.",
    notFound: "Không tìm thấy phiếu sửa chữa.",
    relatedData: "Không thể xóa phiếu sửa chữa vì đang có dữ liệu liên quan.",
    duplicate: "Phiếu sửa chữa đã tồn tại.",
  },
});

const repairOrderController = {
  createRepairOrder: crudController.create,
  getRepairOrderList: crudController.getAll,
  getRepairOrderById: crudController.getById,
  updateRepairOrder: crudController.update,
  deleteRepairOrder: crudController.remove,
};

export default repairOrderController;
