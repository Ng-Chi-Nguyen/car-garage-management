import createCrudController from "../../shared/crud/crud.controllerFactory.js";
import repairOrderDetailService from "../../services/management/repairOrderDetail.service.js";

const crudController = createCrudController({
  service: {
    create: repairOrderDetailService.createRepairOrderDetail,
    getAll: repairOrderDetailService.getRepairOrderDetailList,
    getById: repairOrderDetailService.getRepairOrderDetailById,
    update: repairOrderDetailService.updateRepairOrderDetail,
    remove: repairOrderDetailService.deleteRepairOrderDetail,
  },
  entityKey: "repairOrderDetail",
  messages: {
    createSuccess: "Tạo chi tiết phiếu sửa chữa thành công.",
    listSuccess: "Lấy danh sách chi tiết phiếu sửa chữa thành công.",
    detailSuccess: "Lấy thông tin chi tiết phiếu sửa chữa thành công.",
    updateSuccess: "Cập nhật chi tiết phiếu sửa chữa thành công.",
    deleteSuccess: "Xóa chi tiết phiếu sửa chữa thành công.",
    notFound: "Không tìm thấy chi tiết phiếu sửa chữa.",
    relatedData: "Không thể xóa chi tiết phiếu sửa chữa vì đang có dữ liệu liên quan.",
    duplicate: "Chi tiết phiếu sửa chữa đã tồn tại.",
  },
});

const repairOrderDetailController = {
  createRepairOrderDetail: crudController.create,
  getRepairOrderDetailList: crudController.getAll,
  getRepairOrderDetailById: crudController.getById,
  updateRepairOrderDetail: crudController.update,
  deleteRepairOrderDetail: crudController.remove,
};

export default repairOrderDetailController;
