import createCrudController from "../../shared/crud/crud.controllerFactory.js";
import supplierService from "../../services/management/supplier.service.js";

const crudController = createCrudController({
  service: {
    create: supplierService.createSupplier,
    getAll: supplierService.getSupplierList,
    getById: supplierService.getSupplierById,
    update: supplierService.updateSupplier,
    remove: supplierService.deleteSupplier,
  },
  entityKey: "supplier",
  messages: {
    createSuccess: "Tạo nhà cung cấp thành công.",
    listSuccess: "Lấy danh sách nhà cung cấp thành công.",
    detailSuccess: "Lấy thông tin nhà cung cấp thành công.",
    updateSuccess: "Cập nhật nhà cung cấp thành công.",
    deleteSuccess: "Xóa nhà cung cấp thành công.",
    notFound: "Không tìm thấy nhà cung cấp.",
    relatedData: "Không thể xóa nhà cung cấp vì đang có dữ liệu liên quan.",
    duplicate: "Nhà cung cấp đã tồn tại.",
  },
});

const supplierController = {
  createSupplier: crudController.create,
  getSupplierList: crudController.getAll,
  getSupplierById: crudController.getById,
  updateSupplier: crudController.update,
  deleteSupplier: crudController.remove,
};

export default supplierController;
