// Import Express để tạo router cho nhóm endpoint CRUD.
import express from "express";

// Import middleware validate body theo schema Joi.
import { validate, validateRequest } from "../../middleware/validation.middleware.js";

// Factory tạo router CRUD chuẩn từ schema validate và controller tương ứng.
const createCrudRoute = ({ schema, controller }) => {
  // Khởi tạo router riêng để gắn các route CRUD.
  const router = express.Router();

  // Khai báo chuỗi route CRUD theo thứ tự create, read list, read detail, update, delete.
  router
    // Route tạo mới: validate phần body theo schema.create trước khi gọi controller.create.
    .post("/", validate(schema.create.body), controller.create)
    // Route lấy danh sách: validate query string theo schema.getAll.query.
    .get("/", validateRequest(schema.getAll.query, "query"), controller.getAll)
    // Route lấy chi tiết theo id: validate params theo schema.getById.params.
    .get("/:id", validateRequest(schema.getById.params, "params"), controller.getById)
    // Route cập nhật theo id: validate params trước, sau đó validate body, cuối cùng mới gọi controller.update.
    .put(
      // Đường dẫn nhận id bản ghi cần cập nhật.
      "/:id",
      // Kiểm tra tham số id trên URL.
      validateRequest(schema.update.params, "params"),
      // Kiểm tra payload cập nhật gửi trong body.
      validate(schema.update.body),
      // Hàm xử lý cập nhật chính từ controller.
      controller.update,
    )
    // Route xóa theo id: validate params rồi gọi controller.remove.
    .delete("/:id", validateRequest(schema.delete.params, "params"), controller.remove);

  // Trả về router đã cấu hình đầy đủ để module ngoài mount vào app.
  return router;
};

// Export mặc định factory để tái sử dụng cho các tài nguyên CRUD khác.
export default createCrudRoute;
