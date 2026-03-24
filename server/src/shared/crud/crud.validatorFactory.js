// Import Joi để định nghĩa schema validate cho params/query/body.
import Joi from "joi";
import { buildListQuerySchemaFromFilters } from "./crudFilterSchema.helpers.js";

// Schema chuẩn cho param `id` ở các API lấy/sửa/xóa theo id.
const idParamsSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
}).unknown(false);

// Schema query list mặc định khi không truyền filterFields/listQuerySchema riêng.
const defaultListQuerySchema = buildListQuerySchemaFromFilters();

// Factory tạo bộ validator CRUD đồng nhất cho từng resource.
const createCrudValidator = ({
  createBodySchema,
  updateBodySchema,
  listQuerySchema,
  filterFields,
}) => {
  const resolvedListQuerySchema =
    listQuerySchema ??
    (filterFields ? buildListQuerySchemaFromFilters(filterFields) : defaultListQuerySchema);

  return {
    create: {
      body: createBodySchema,
    },
    getAll: {
      query: resolvedListQuerySchema,
    },
    getById: {
      params: idParamsSchema,
    },
    update: {
      params: idParamsSchema,
      body: updateBodySchema,
    },
    delete: {
      params: idParamsSchema,
    },
  };
};

export default createCrudValidator;
