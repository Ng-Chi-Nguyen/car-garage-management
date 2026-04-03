const IMAGE_FILE_SIZE_LIMIT = 5 * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

let multerModulePromise;

const loadMulterModule = () => {
  multerModulePromise ??= import("multer");
  return multerModulePromise;
};

const createUploadMiddleware = (fieldName) => {
  return (req, res, next) => {
    loadMulterModule()
      .then(({ default: multer, MulterError }) => {
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

        upload(req, res, (error) => {
          if (!error) {
            next();
            return;
          }

          if (error instanceof MulterError && error.code === "LIMIT_FILE_SIZE") {
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
      })
      .catch((error) => {
        res.status(500).json({
          success: false,
          message: error.message || "Không thể khởi tạo middleware upload.",
        });
      });
  };
};

export { createUploadMiddleware };
