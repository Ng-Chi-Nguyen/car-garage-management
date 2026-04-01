import prisma from "../../db/prisma.js";
import {
  buildListWhere,
  buildPagination,
  buildServiceError,
  buildWriteData,
} from "../../shared/crud/crud.helpers.js";

const PART_FILTER_FIELDS = {
  MaVatTu: { type: "number", positive: true },
  TenVatTu: { type: "string" },
  DonViTinh: { type: "string" },
  SoLuongTon: { type: "number", min: 0 },
  GiaVon: { type: "decimal", min: 0 },
  DonGiaBan: { type: "decimal", min: 0 },
  MaNCC: { type: "number", positive: true },
};

const WRITE_FIELDS = ["TenVatTu", "DonViTinh", "GiaVon", "DonGiaBan", "MaNCC"];
const PART_INCLUDE_SUPPLIER = {
  NhaCungCap: {
    select: {
      MaNCC: true,
      TenNCC: true,
    },
  },
};

const getPartByIdInternal = async (db, id) => {
  const part = await db.vAT_TU.findUnique({
    where: {
      MaVatTu: Number(id),
    },
    include: PART_INCLUDE_SUPPLIER,
  });

  if (!part) {
    throw buildServiceError(404, "Không tìm thấy vật tư.");
  }

  return part;
};

const partService = {
  createPart: async (payload) => {
    return prisma.vAT_TU.create({
      data: {
        ...buildWriteData(payload, WRITE_FIELDS),
        SoLuongTon: 0,
      },
    });
  },
  getPartList: async ({ page = 1, limit = 10, search = "", ...filters } = {}) => {
    const pagination = buildPagination({ page, limit });
    const where = buildListWhere({
      search,
      filters,
      searchFields: ["TenVatTu", "DonViTinh"],
      filterFields: PART_FILTER_FIELDS,
    });

    const [totalItems, parts] = await prisma.$transaction([
      prisma.vAT_TU.count({ where }),
      prisma.vAT_TU.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        include: PART_INCLUDE_SUPPLIER,
        orderBy: {
          MaVatTu: "desc",
        },
      }),
    ]);

    return {
      parts,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pagination.limit),
      },
    };
  },
  getPartById: async (id) => getPartByIdInternal(prisma, id),
  updatePart: async (id, payload) => {
    await getPartByIdInternal(prisma, id);

    return prisma.vAT_TU.update({
      where: {
        MaVatTu: Number(id),
      },
      data: buildWriteData(payload, WRITE_FIELDS),
    });
  },
  deletePart: async (id) => {
    await getPartByIdInternal(prisma, id);

    return prisma.vAT_TU.delete({
      where: {
        MaVatTu: Number(id),
      },
    });
  },
};

export { PART_INCLUDE_SUPPLIER };
export default partService;
