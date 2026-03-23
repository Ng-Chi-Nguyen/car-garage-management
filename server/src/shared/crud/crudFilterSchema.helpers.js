// Import Joi để xây dựng schema validate cho query filter.
import Joi from "joi";
// Import hàm chuẩn hóa chuỗi để so khớp enum không phụ thuộc kiểu viết.
import { normalizeKeyword } from "./crud.helpers.js";

// Tạo schema Joi cho filter kiểu enum, có hỗ trợ alias và dạng multi-value.
const buildEnumSchema = (descriptor = {}) => {
  // Chuẩn hóa descriptor.values thành mảng để xử lý thống nhất.
  const values = Array.isArray(descriptor.values)
    // Nếu đã là mảng thì dùng trực tiếp.
    ? descriptor.values
    // Nếu không truyền values thì dùng mảng rỗng.
    : descriptor.values === undefined
      ? []
      // Nếu truyền 1 giá trị đơn thì bọc thành mảng.
      : [descriptor.values];
  // Lấy danh sách key alias từ descriptor.aliases (nếu có).
  const aliasKeys = Object.keys(descriptor.aliases ?? {});
  // Gộp values và alias, loại trùng, rồi ép về string để so khớp nhất quán.
  const acceptedValues = [...new Set([...values, ...aliasKeys])].map((value) => String(value));
  // Tạo tập giá trị đã chuẩn hóa để so sánh nhanh và không phân biệt cách nhập.
  const acceptedNormalizedValues = new Set(
    // Chuẩn hóa từng giá trị hợp lệ.
    acceptedValues.map((value) => normalizeKeyword(value)).filter((value) => value !== ""),
  );
  // Tạo schema cho 1 giá trị enum ở dạng chuỗi.
  const enumValueSchema = Joi.string()
    // Loại bỏ khoảng trắng đầu/cuối trước khi validate.
    .trim()
    // Dùng custom validator để kiểm tra theo danh sách chuẩn hóa.
    .custom((value, helpers) => {
      // Nếu không cấu hình giá trị hợp lệ nào thì cho qua.
      if (acceptedNormalizedValues.size === 0) {
        return value;
      }

      // Nếu giá trị nhập vào nằm trong tập hợp lệ sau chuẩn hóa thì hợp lệ.
      if (acceptedNormalizedValues.has(normalizeKeyword(value))) {
        return value;
      }

      // Nếu không khớp thì trả lỗi invalid của Joi.
      return helpers.error("any.invalid");
    }, "enum value with normalized alias support");

  // Nếu enum cho phép nhiều giá trị thì nhận cả string đơn hoặc mảng string.
  if (descriptor.multi) {
    return Joi.alternatives()
      // Chấp nhận 1 giá trị đơn hoặc mảng có ít nhất 1 phần tử.
      .try(enumValueSchema, Joi.array().items(enumValueSchema).min(1))
      // Toàn bộ filter là optional trong query.
      .optional();
  }

  // Mặc định enum chỉ nhận 1 giá trị và là optional.
  return enumValueSchema.optional();
};

// Tạo schema Joi cho từng loại filter được khai báo trong descriptor.
const buildFilterQuerySchema = (descriptor = {}) => {
  // Danh sách type filter được hệ thống hỗ trợ.
  const supportedFilterTypes = new Set([
    "string",
    "enum",
    "number",
    "decimal",
    "dateFrom",
    "dateTo",
  ]);

  // Chặn sớm các type không hỗ trợ để tránh tạo schema sai.
  if (!supportedFilterTypes.has(descriptor.type)) {
    throw new Error(`Unsupported filter type: ${String(descriptor.type)}`);
  }

  // Filter kiểu string: cho phép chuỗi và tự trim khoảng trắng.
  if (descriptor.type === "string") {
    return Joi.string().trim().optional();
  }

  // Filter kiểu enum: dựng schema bằng helper riêng để hỗ trợ alias/multi.
  if (descriptor.type === "enum") {
    return buildEnumSchema(descriptor);
  }

  // Filter kiểu number: bắt buộc là số nguyên.
  if (descriptor.type === "number") {
    // Khởi tạo schema số nguyên.
    let schema = Joi.number().integer();

    // Nếu yêu cầu dương thì thêm ràng buộc positive.
    if (descriptor.positive) {
      schema = schema.positive();
    }

    // Nếu có min thì áp ràng buộc giá trị tối thiểu.
    if (descriptor.min !== undefined) {
      schema = schema.min(descriptor.min);
    }

    // Filter query luôn optional để không bắt buộc người dùng truyền.
    return schema.optional();
  }

  // Filter kiểu decimal: cho phép số thập phân.
  if (descriptor.type === "decimal") {
    // Khởi tạo schema number cơ bản (không ép integer).
    let schema = Joi.number();

    // Nếu yêu cầu dương thì thêm ràng buộc positive.
    if (descriptor.positive) {
      schema = schema.positive();
    }

    // Nếu có min thì áp ràng buộc giá trị tối thiểu.
    if (descriptor.min !== undefined) {
      schema = schema.min(descriptor.min);
    }

    // Filter query luôn optional để có thể bỏ qua.
    return schema.optional();
  }

  // Filter ngày bắt đầu/kết thúc: chấp nhận kiểu date của Joi.
  if (descriptor.type === "dateFrom" || descriptor.type === "dateTo") {
    return Joi.date().optional();
  }

  // Nhánh dự phòng an toàn nếu phát sinh type lạ ngoài kiểm tra đầu hàm.
  throw new Error(`Unsupported filter type: ${String(descriptor.type)}`);
};

// Tạo schema query cho API list dựa trên các field filter được cấu hình.
const buildListQuerySchemaFromFilters = (filterFields = {}) => {
  // Duyệt từng field filter để build schema tương ứng.
  const filterSchema = Object.entries(filterFields).reduce((accumulator, [field, descriptor]) => {
    // Gán schema đã build vào key field tương ứng.
    accumulator[field] = buildFilterQuerySchema(descriptor);
    // Trả accumulator cho vòng reduce tiếp theo.
    return accumulator;
  }, {});

  // Kết hợp schema phân trang, tìm kiếm và toàn bộ schema filter động.
  return Joi.object({
    // Trang hiện tại, mặc định là 1.
    page: Joi.number().integer().positive().default(1),
    // Số bản ghi mỗi trang, mặc định là 10.
    limit: Joi.number().integer().positive().default(10),
    // Từ khóa tìm kiếm, cho phép chuỗi rỗng.
    search: Joi.string().trim().allow("").optional(),
    // Trải các filter động vào object schema query.
    ...filterSchema,
    // Không cho phép key query ngoài danh sách định nghĩa.
  }).unknown(false);
};

// Export helper để các factory validator CRUD tái sử dụng.
export { buildListQuerySchemaFromFilters };
