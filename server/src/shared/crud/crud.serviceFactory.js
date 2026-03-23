// Import Prisma client dùng để thao tác database.
import prisma from "../../db/prisma.js";
// Import helper dựng where tổng hợp cho API danh sách.
import {
  // Helper kết hợp search + filter thành where cho Prisma.
  buildListWhere,
  // Helper chuẩn hóa page/limit và tính skip.
  buildPagination,
  // Helper tạo lỗi nghiệp vụ có status HTTP đi kèm.
  buildServiceError,
  // Helper lọc payload theo whitelist field được phép ghi.
  buildWriteData,
} from "./crud.helpers.js";

// Factory tạo service CRUD dùng chung cho nhiều module.
const createCrudService = ({
  // Tên delegate Prisma (ví dụ: car, customer, ...).
  delegateName,
  // Tên trường ID chính của bảng/model.
  idField,
  // Danh sách field cho phép ghi khi create.
  createFields,
  // Danh sách field cho phép update; mặc định dùng chung với createFields.
  updateFields = createFields,
  // Danh sách field được phép tìm kiếm tự do.
  searchFields = [],
  // Cấu hình field lọc nâng cao.
  filterFields = {},
  // Key chứa danh sách item trong response list.
  listKey,
  // Field sắp xếp mặc định cho list; mặc định theo idField.
  orderByField = idField,
  // Message dùng khi không tìm thấy bản ghi.
  notFoundMessage,
}) => {
  // Lấy delegate Prisma tương ứng theo tên model truyền vào.
  const delegate = prisma[delegateName];

  // Hàm tạo mới bản ghi.
  const create = async (payload) => {
    // Gọi Prisma create với dữ liệu đã lọc theo whitelist createFields.
    return delegate.create({
      data: buildWriteData(payload, createFields),
    });
  };

  // Hàm lấy danh sách có hỗ trợ search, filter và phân trang.
  const getAll = async (query = {}) => {
    // Tách page/limit/search ra khỏi query; phần còn lại coi là filters.
    const { page = 1, limit = 10, search = "", ...filters } = query;
    // Chuẩn hóa thông số phân trang.
    const pagination = buildPagination({ page, limit });
    // Tạo điều kiện where tổng hợp từ search + filters.
    const where = buildListWhere({ search, filters, searchFields, filterFields });

    const [totalItems, items] = await prisma.$transaction([
      delegate.count({ where }),
      delegate.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: {
          [orderByField]: "desc",
        },
      }),
    ]);

    return {
      [listKey]: items,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pagination.limit),
      },
    };
  };

  const getById = async (id) => {
    const item = await delegate.findUnique({
      where: {
        [idField]: Number(id),
      },
    });

    if (!item) {
      throw buildServiceError(404, notFoundMessage);
    }

    return item;
  };

  const update = async (id, payload) => {
    await getById(id);

    return delegate.update({
      where: {
        [idField]: Number(id),
      },
      data: buildWriteData(payload, updateFields),
    });
  };

  const remove = async (id) => {
    await getById(id);

    return delegate.delete({
      where: {
        [idField]: Number(id),
      },
    });
  };

  return {
    create,
    getAll,
    getById,
    update,
    remove,
  };
};

export default createCrudService;
