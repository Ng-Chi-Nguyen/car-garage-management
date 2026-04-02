import prisma from "../../db/prisma.js";
import {
  buildListWhere,
  buildPagination,
  runWithDbRetry,
  buildServiceError,
  buildWriteData,
} from "../../shared/crud/crud.helpers.js";

const VEHICLE_FILTER_FIELDS = {
  MaXe: { type: "number", positive: true },
  BienSo: { type: "string" },
  MaHieuXe: { type: "number", positive: true },
  MaKH: { type: "number", positive: true },
  TienNoHienTai: { type: "decimal", min: 0 },
};

const WRITE_FIELDS = ["BienSo", "MaHieuXe", "MaKH"];
const VEHICLE_INCLUDE_RELATIONS = {
  HieuXe: {
    select: {
      MaHieuXe: true,
      TenHieuXe: true,
    },
  },
  KhachHang: {
    select: {
      MaKH: true,
      TenChuXe: true,
      DienThoai: true,
    },
  },
};

const getVehicleByIdInternal = async (db, id) => {
  const vehicle = await db.xE.findUnique({
    where: {
      MaXe: Number(id),
    },
    include: VEHICLE_INCLUDE_RELATIONS,
  });

  if (!vehicle) {
    throw buildServiceError(404, "Không tìm thấy xe.");
  }

  return vehicle;
};

const vehicleService = {
  createVehicle: async (payload) => {
    return prisma.xE.create({
      data: {
        ...buildWriteData(payload, WRITE_FIELDS),
        TienNoHienTai: 0,
      },
    });
  },
  getVehicleList: async ({ page = 1, limit = 10, search = "", ...filters } = {}) => {
    const pagination = buildPagination({ page, limit });
    const where = buildListWhere({
      search,
      filters,
      searchFields: ["BienSo"],
      filterFields: VEHICLE_FILTER_FIELDS,
    });

    const [totalItems, vehicles] = await runWithDbRetry(() => Promise.all([
      prisma.xE.count({ where }),
      prisma.xE.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        include: VEHICLE_INCLUDE_RELATIONS,
        orderBy: {
          MaXe: "desc",
        },
      }),
    ]));

    return {
      vehicles,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pagination.limit),
      },
    };
  },
  getVehicleById: async (id) => getVehicleByIdInternal(prisma, id),
  updateVehicle: async (id, payload) => {
    await getVehicleByIdInternal(prisma, id);

    return prisma.xE.update({
      where: {
        MaXe: Number(id),
      },
      data: buildWriteData(payload, WRITE_FIELDS),
    });
  },
  deleteVehicle: async (id) => {
    await getVehicleByIdInternal(prisma, id);

    return prisma.xE.delete({
      where: {
        MaXe: Number(id),
      },
    });
  },
};

export { VEHICLE_INCLUDE_RELATIONS };
export default vehicleService;
