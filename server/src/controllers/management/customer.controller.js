import customerService from "../../services/management/customer.service.js";

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
  createSuccess: "Tạo khách hàng thành công.",
  listSuccess: "Lấy danh sách khách hàng thành công.",
  detailSuccess: "Lấy thông tin khách hàng thành công.",
  updateSuccess: "Cập nhật khách hàng thành công.",
  deleteSuccess: "Xóa khách hàng thành công.",
  notFound: "Không tìm thấy khách hàng.",
  relatedData: "Không thể xóa khách hàng vì đang có dữ liệu liên quan.",
  duplicate: "Khách hàng đã tồn tại.",
};

const createCustomerController = (service = customerService) => ({
  createCustomer: async (req, res) => {
    try {
      const customer = await service.createCustomer(req.body, req.file);

      return res.status(201).json({
        success: true,
        message: messages.createSuccess,
        data: { customer },
      });
    } catch (error) {
      return handleError(res, error, messages);
    }
  },
  getCustomerList: async (req, res) => {
    try {
      const result = await service.getCustomerList(req.validatedQuery ?? req.query);

      return res.json({
        success: true,
        message: messages.listSuccess,
        data: result,
      });
    } catch (error) {
      return handleError(res, error, messages);
    }
  },
  getCustomerById: async (req, res) => {
    try {
      const customer = await service.getCustomerById(req.validatedParams?.id ?? req.params.id);

      return res.json({
        success: true,
        message: messages.detailSuccess,
        data: { customer },
      });
    } catch (error) {
      return handleError(res, error, messages);
    }
  },
  updateCustomer: async (req, res) => {
    try {
      const customer = await service.updateCustomer(req.validatedParams?.id ?? req.params.id, req.body, req.file);

      return res.json({
        success: true,
        message: messages.updateSuccess,
        data: { customer },
      });
    } catch (error) {
      return handleError(res, error, messages);
    }
  },
  deleteCustomer: async (req, res) => {
    try {
      const customer = await service.deleteCustomer(req.validatedParams?.id ?? req.params.id);

      return res.json({
        success: true,
        message: messages.deleteSuccess,
        data: { customer },
      });
    } catch (error) {
      return handleError(res, error, messages);
    }
  },
});

const customerController = createCustomerController();

export { createCustomerController };
export default customerController;
