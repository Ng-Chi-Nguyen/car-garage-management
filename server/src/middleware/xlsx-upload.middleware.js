import multer from "multer";

const XLSX_FILE_SIZE_LIMIT = 10 * 1024 * 1024;
const XLSX_MIME_TYPES = new Set([
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/octet-stream",
]);

const createXlsxUploadMiddleware = (fieldName = "file") => {
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: XLSX_FILE_SIZE_LIMIT,
    },
    fileFilter: (_req, file, callback) => {
      const hasValidExtension = file.originalname?.toLowerCase().endsWith(".xlsx");
      const hasValidMimeType = XLSX_MIME_TYPES.has(file.mimetype);

      if (!hasValidExtension && !hasValidMimeType) {
        callback(new Error("Chỉ chấp nhận file .xlsx."));
        return;
      }

      callback(null, true);
    },
  }).single(fieldName);

  return (req, res, next) => {
    upload(req, res, (error) => {
      if (!error) {
        next();
        return;
      }

      if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
        res.status(400).json({
          success: false,
          message: "Kích thước file .xlsx không được vượt quá 10MB.",
        });
        return;
      }

      res.status(400).json({
        success: false,
        message: error.message || "File .xlsx không hợp lệ.",
      });
    });
  };
};

const requireXlsxFile = (req, res, next) => {
  if (req.file?.buffer) {
    next();
    return;
  }

  res.status(400).json({
    success: false,
    message: "Vui lòng tải lên file .xlsx.",
  });
};

export { createXlsxUploadMiddleware, requireXlsxFile };
