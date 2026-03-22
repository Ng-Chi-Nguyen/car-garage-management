import createCrudController from "../../shared/crud/crud.controllerFactory.js";
import customerService from "../../services/management/customer.service.js";

const crudController = createCrudController({
  service: {
    create: customerService.createCustomer,
    getAll: customerService.getCustomerList,
    getById: customerService.getCustomerById,
    update: customerService.updateCustomer,
    remove: customerService.deleteCustomer,
  },
  entityKey: "customer",
  messages: {
    createSuccess: "Tạo khách hàng thành công.",
    listSuccess: "Lấy danh sách khách hàng thành công.",
    detailSuccess: "Lấy thông tin khách hàng thành công.",
    updateSuccess: "Cập nhật khách hàng thành công.",
    deleteSuccess: "Xóa khách hàng thành công.",
    notFound: "Không tìm thấy khách hàng.",
    relatedData: "Không thể xóa khách hàng vì đang có dữ liệu liên quan.",
    duplicate: "Khách hàng đã tồn tại.",
  },
});

const customerController = {
  createCustomer: crudController.create,
  getCustomerList: crudController.getAll,
  getCustomerById: crudController.getById,
  updateCustomer: crudController.update,
  deleteCustomer: crudController.remove,
};

export default customerController;
