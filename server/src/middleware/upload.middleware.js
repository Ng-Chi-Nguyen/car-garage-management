import multer from "multer";

const IMAGE_FILE_SIZE_LIMIT = 5 * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const createUploadMiddleware = (fieldName) => {
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: IMAGE_FILE_SIZE_LIMIT,
    },
    fileFilter: (_req, file, callback) => {
      if (!ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
        callback(new Error("Chỉ chấp nhận file ảnh JPG, PNG hoặc WEBP."));
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
          message: "Kích thước ảnh không được vượt quá 5MB.",
        });
        return;
      }

      res.status(400).json({
        success: false,
        message: error.message || "File upload không hợp lệ.",
      });
    });
  };
};

export { createUploadMiddleware };
