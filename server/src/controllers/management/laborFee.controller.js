import createCrudController from "../../shared/crud/crud.controllerFactory.js";
import laborFeeService from "../../services/management/laborFee.service.js";

const crudController = createCrudController({
  service: {
    create: laborFeeService.createLaborFee,
    getAll: laborFeeService.getLaborFeeList,
    getById: laborFeeService.getLaborFeeById,
    update: laborFeeService.updateLaborFee,
    remove: laborFeeService.deleteLaborFee,
  },
  entityKey: "laborFee",
  messages: {
    createSuccess: "Tạo tiền công thành công.",
    listSuccess: "Lấy danh sách tiền công thành công.",
    detailSuccess: "Lấy thông tin tiền công thành công.",
    updateSuccess: "Cập nhật tiền công thành công.",
    deleteSuccess: "Xóa tiền công thành công.",
    notFound: "Không tìm thấy tiền công.",
    relatedData: "Không thể xóa tiền công vì đang có dữ liệu liên quan.",
    duplicate: "Tiền công đã tồn tại.",
  },
});

const laborFeeController = {
  createLaborFee: crudController.create,
  getLaborFeeList: crudController.getAll,
  getLaborFeeById: crudController.getById,
  updateLaborFee: crudController.update,
  deleteLaborFee: crudController.remove,
};

export default laborFeeController;
