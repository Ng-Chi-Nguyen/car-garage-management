const handleError = (res, error, messages) => {
  if (error?.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: messages.notFound,
    });
  }

  if (error?.code === "P2003") {
    return res.status(409).json({
      success: false,
      message: messages.relatedData,
    });
  }

  if (error?.code === "P2002") {
    return res.status(409).json({
      success: false,
      message:
        typeof messages.duplicate === "function"
          ? messages.duplicate(error)
          : messages.duplicate,
    });
  }

  if (error?.code === "P2034") {
    return res.status(409).json({
      success: false,
      message: "Dữ liệu vừa thay đổi, vui lòng thử lại.",
    });
  }

  return res.status(error?.status || 500).json({
    success: false,
    message: error?.message || "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.",
    ...(error?.errorCode ? { errorCode: error.errorCode } : {}),
    ...(error?.details !== undefined ? { details: error.details } : {}),
  });
};

const createCrudController = ({ service, entityKey, messages }) => {
  return {
    create: async (req, res) => {
      try {
        const item = await service.create(req.body);

        return res.status(201).json({
          success: true,
          message: messages.createSuccess,
          data: { [entityKey]: item },
        });
      } catch (error) {
        return handleError(res, error, messages);
      }
    },

    getAll: async (req, res) => {
      try {
        const result = await service.getAll(req.validatedQuery ?? req.query);

        return res.json({
          success: true,
          message: messages.listSuccess,
          data: result,
        });
      } catch (error) {
        return handleError(res, error, messages);
      }
    },

    getById: async (req, res) => {
      try {
        const item = await service.getById(req.validatedParams?.id ?? req.params.id);

        return res.json({
          success: true,
          message: messages.detailSuccess,
          data: { [entityKey]: item },
        });
      } catch (error) {
        return handleError(res, error, messages);
      }
    },

    update: async (req, res) => {
      try {
        const item = await service.update(req.validatedParams?.id ?? req.params.id, req.body);

        return res.json({
          success: true,
          message: messages.updateSuccess,
          data: { [entityKey]: item },
        });
      } catch (error) {
        return handleError(res, error, messages);
      }
    },

    remove: async (req, res) => {
      try {
        const item = await service.remove(req.validatedParams?.id ?? req.params.id);

        return res.json({
          success: true,
          message: messages.deleteSuccess,
          data: { [entityKey]: item },
        });
      } catch (error) {
        return handleError(res, error, messages);
      }
    },
  };
};

export default createCrudController;
