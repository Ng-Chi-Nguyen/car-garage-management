import createCrudController from "../../shared/crud/crud.controllerFactory.js";
import partService from "../../services/management/part.service.js";

const crudController = createCrudController({
  service: {
    create: partService.createPart,
    getAll: partService.getPartList,
    getById: partService.getPartById,
    update: partService.updatePart,
    remove: partService.deletePart,
  },
  entityKey: "part",
  messages: {
    createSuccess: "Tạo vật tư thành công.",
    listSuccess: "Lấy danh sách vật tư thành công.",
    detailSuccess: "Lấy thông tin vật tư thành công.",
    updateSuccess: "Cập nhật vật tư thành công.",
    deleteSuccess: "Xóa vật tư thành công.",
    notFound: "Không tìm thấy vật tư.",
    relatedData: "Không thể xóa vật tư vì đang có dữ liệu liên quan.",
    duplicate: "Vật tư đã tồn tại.",
  },
});

const partController = {
  createPart: crudController.create,
  getPartList: crudController.getAll,
  getPartById: crudController.getById,
  updatePart: crudController.update,
  deletePart: crudController.remove,
};

export default partController;
