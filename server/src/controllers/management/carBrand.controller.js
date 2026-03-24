import carBrandService from "../../services/management/carBrand.service.js";

const handleError = (res, error, messages) => {
  if (error?.code === "P2025") {
    return res.status(404).json({ success: false, message: messages.notFound });
  }

  if (error?.code === "P2003") {
    return res.status(409).json({ success: false, message: messages.relatedData });
  }

  if (error?.code === "P2002") {
    return res.status(409).json({ success: false, message: messages.duplicate });
  }

  return res.status(error?.status || 500).json({
    success: false,
    message: error?.message || "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.",
  });
};

const messages = {
  createSuccess: "Tạo hiệu xe thành công.",
  listSuccess: "Lấy danh sách hiệu xe thành công.",
  detailSuccess: "Lấy thông tin hiệu xe thành công.",
  updateSuccess: "Cập nhật hiệu xe thành công.",
  deleteSuccess: "Xóa hiệu xe thành công.",
  notFound: "Không tìm thấy hiệu xe.",
  relatedData: "Không thể xóa hiệu xe vì đang có dữ liệu liên quan.",
  duplicate: "Hiệu xe đã tồn tại.",
};

const createCarBrandController = (service = carBrandService) => ({
  createCarBrand: async (req, res) => {
    try {
      const carBrand = await service.createCarBrand(req.body, req.file);

      return res.status(201).json({
        success: true,
        message: messages.createSuccess,
        data: { carBrand },
      });
    } catch (error) {
      return handleError(res, error, messages);
    }
  },
  getCarBrandList: async (req, res) => {
    try {
      const result = await service.getCarBrandList(req.validatedQuery ?? req.query);

      return res.json({
        success: true,
        message: messages.listSuccess,
        data: result,
      });
    } catch (error) {
      return handleError(res, error, messages);
    }
  },
  getCarBrandById: async (req, res) => {
    try {
      const carBrand = await service.getCarBrandById(req.validatedParams?.id ?? req.params.id);

      return res.json({
        success: true,
        message: messages.detailSuccess,
        data: { carBrand },
      });
    } catch (error) {
      return handleError(res, error, messages);
    }
  },
  updateCarBrand: async (req, res) => {
    try {
      const carBrand = await service.updateCarBrand(req.validatedParams?.id ?? req.params.id, req.body, req.file);

      return res.json({
        success: true,
        message: messages.updateSuccess,
        data: { carBrand },
      });
    } catch (error) {
      return handleError(res, error, messages);
    }
  },
  deleteCarBrand: async (req, res) => {
    try {
      const carBrand = await service.deleteCarBrand(req.validatedParams?.id ?? req.params.id);

      return res.json({
        success: true,
        message: messages.deleteSuccess,
        data: { carBrand },
      });
    } catch (error) {
      return handleError(res, error, messages);
    }
  },
});

const carBrandController = createCarBrandController();

export { createCarBrandController };
export default carBrandController;
