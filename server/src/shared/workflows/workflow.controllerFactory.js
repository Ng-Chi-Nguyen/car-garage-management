const handleWorkflowError = (res, error) => {
  if (error?.code === "P2034") {
    return res.status(409).json({
      success: false,
      message: "Dữ liệu vừa thay đổi, vui lòng thử lại.",
    });
  }

  return res.status(error?.status || 500).json({
    success: false,
    message: error?.message || "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.",
  });
};

const createWorkflowController = ({ service, successMessage }) => {
  return {
    create: async (req, res) => {
      try {
        const data = await service.create(req.body);

        return res.status(201).json({
          success: true,
          message: successMessage,
          data,
        });
      } catch (error) {
        return handleWorkflowError(res, error);
      }
    },
  };
};

export default createWorkflowController;
