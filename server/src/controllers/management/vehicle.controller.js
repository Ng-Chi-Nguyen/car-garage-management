import createCrudController from "../../shared/crud/crud.controllerFactory.js";
import vehicleService from "../../services/management/vehicle.service.js";

const crudController = createCrudController({
  service: {
    create: vehicleService.createVehicle,
    getAll: vehicleService.getVehicleList,
    getById: vehicleService.getVehicleById,
    update: vehicleService.updateVehicle,
    remove: vehicleService.deleteVehicle,
  },
  entityKey: "vehicle",
  messages: {
    createSuccess: "Tạo xe thành công.",
    listSuccess: "Lấy danh sách xe thành công.",
    detailSuccess: "Lấy thông tin xe thành công.",
    updateSuccess: "Cập nhật xe thành công.",
    deleteSuccess: "Xóa xe thành công.",
    notFound: "Không tìm thấy xe.",
    relatedData: "Không thể xóa xe vì đang có dữ liệu liên quan.",
    duplicate: "Xe đã tồn tại.",
  },
});

const vehicleController = {
  createVehicle: crudController.create,
  getVehicleList: crudController.getAll,
  getVehicleById: crudController.getById,
  updateVehicle: crudController.update,
  deleteVehicle: crudController.remove,
};

export default vehicleController;
