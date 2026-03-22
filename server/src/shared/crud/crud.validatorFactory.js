// Import Joi để định nghĩa schema validate cho params/query/body.
import Joi from "joi";
// Import helper tạo schema query list dựa trên cấu hình filter.
import { buildListQuerySchemaFromFilters } from "./crudFilterSchema.helpers.js";

// Schema chuẩn cho param `id` ở các API lấy/sửa/xóa theo id.
const idParamsSchema = Joi.object({
  // `id` phải là số nguyên dương và bắt buộc có trong params.
  id: Joi.number().integer().positive().required(),
  // Không cho phép thêm params ngoài `id`.
}).unknown(false);

// Schema query list mặc định khi không truyền filterFields/listQuerySchema riêng.
const defaultListQuerySchema = buildListQuerySchemaFromFilters();

// Factory tạo bộ validator CRUD đồng nhất cho từng resource.
const createCrudValidator = ({
  // Schema validate body cho API tạo mới.
  createBodySchema,
  // Schema validate body cho API cập nhật.
  updateBodySchema,
  // Schema query list tùy chỉnh, ưu tiên cao nhất nếu được truyền vào.
  listQuerySchema,
  // Cấu hình field filter để tự động build listQuerySchema nếu cần.
  filterFields,
}) => {
  // Quy tắc chọn schema query list: dùng schema truyền trực tiếp, nếu không thì build từ filterFields, cuối cùng fallback mặc định.
  const resolvedListQuerySchema =
    listQuerySchema ??
    (filterFields ? buildListQuerySchemaFromFilters(filterFields) : defaultListQuerySchema);

  // Trả object validator theo chuẩn các action CRUD.
  return {
    // Validator cho action create.
    create: {
      // Validate phần body bằng schema create tương ứng.
      body: createBodySchema,
    },
    // Validator cho action lấy danh sách.
    getAll: {
      // Validate query bằng schema đã resolve theo thứ tự ưu tiên.
      query: resolvedListQuerySchema,
    },
    // Validator cho action lấy chi tiết theo id.
    getById: {
      // Validate params bằng schema id chuẩn dùng chung.
      params: idParamsSchema,
    },
    // Validator cho action cập nhật theo id.
    update: {
      // Validate params id.
      params: idParamsSchema,
      // Validate body cập nhật.
      body: updateBodySchema,
    },
    // Validator cho action xóa theo id.
    delete: {
      // Validate params id trước khi xử lý xóa.
      params: idParamsSchema,
    },
  };
};

// Export factory làm mặc định để các module CRUD khác import trực tiếp.
export default createCrudValidator;
