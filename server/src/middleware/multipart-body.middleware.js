const validateMultipartBody = (schema, { allowFileOnly = false } = {}) => (req, res, next) => {
  const body = req.body ?? {};

  if (allowFileOnly && req.file && Object.keys(body).length === 0) {
    req.body = body;
    next();
    return;
  }

  const { error, value } = schema.validate(body, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message.replace(/['"]+/g, ""));

    res.status(400).json({
      success: false,
      message: "Dữ liệu đầu vào không hợp lệ (Validation Failed).",
      errors: errorMessages,
    });
    return;
  }

  req.body = value;
  next();
};

export { validateMultipartBody };
