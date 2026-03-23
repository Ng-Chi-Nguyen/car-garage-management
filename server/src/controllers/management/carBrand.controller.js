import createCrudController from "../../shared/crud/crud.controllerFactory.js";
import carBrandService from "../../services/management/carBrand.service.js";

const crudController = createCrudController({
  service: {
    create: carBrandService.createCarBrand,
    getAll: carBrandService.getCarBrandList,
    getById: carBrandService.getCarBrandById,
    update: carBrandService.updateCarBrand,
    remove: carBrandService.deleteCarBrand,
  },
  entityKey: "carBrand",
  messages: {
    createSuccess: "Tạo hiệu xe thành công.",
    listSuccess: "Lấy danh sách hiệu xe thành công.",
    detailSuccess: "Lấy thông tin hiệu xe thành công.",
    updateSuccess: "Cập nhật hiệu xe thành công.",
    deleteSuccess: "Xóa hiệu xe thành công.",
    notFound: "Không tìm thấy hiệu xe.",
    relatedData: "Không thể xóa hiệu xe vì đang có dữ liệu liên quan.",
    duplicate: "Hiệu xe đã tồn tại.",
  },
});

const carBrandController = {
  createCarBrand: crudController.create,
  getCarBrandList: crudController.getAll,
  getCarBrandById: crudController.getById,
  updateCarBrand: crudController.update,
  deleteCarBrand: crudController.remove,
};

export default carBrandController;
