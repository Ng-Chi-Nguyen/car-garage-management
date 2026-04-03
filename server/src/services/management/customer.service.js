import prisma from "../../db/prisma.js";
import {
  buildListWhere,
  buildPagination,
  runWithDbRetry,
  buildServiceError,
  buildWriteData,
} from "../../shared/crud/crud.helpers.js";
import { processAvatarImage as processAvatarImageUtil } from "../../utils/image.util.js";
import {
  removeObject as removeObjectUtil,
  resolveStorageObjectFromPublicUrl,
  uploadPublicImage as uploadPublicImageUtil,
} from "../../utils/supabase.storage.js";

const CUSTOMER_FILTER_FIELDS = {
  MaKH: { type: "number" },
  Email: { type: "string" },
  TenChuXe: { type: "string" },
  DienThoai: { type: "string" },
  DiaChi: { type: "string" },
  ChucVu: { type: "enum", values: ["NhanVien", "KhachHang"] },
  TrangThai: { type: "enum", values: ["HoatDong", "BiKhoa", "DaXoa"], multi: true },
  BienSo: { type: "string", relation: "Xe", relationMode: "some", targetField: "BienSo" },
  CongNoFrom: {
    type: "decimal",
    min: 0,
    targetField: "totalDebt",
    aggregate: "sumDebt",
    relation: "Xe",
  },
  CongNoTo: {
    type: "decimal",
    min: 0,
    targetField: "totalDebt",
    aggregate: "sumDebt",
    relation: "Xe",
  },
  NgayTaoFrom: { type: "dateFrom", targetField: "NgayTao" },
  NgayTaoTo: { type: "dateTo", targetField: "NgayTao" },
  NgayCapNhatFrom: { type: "dateFrom", targetField: "NgayCapNhat" },
  NgayCapNhatTo: { type: "dateTo", targetField: "NgayCapNhat" },
};

const CUSTOMER_WRITE_FIELDS = ["Email", "TenChuXe", "DienThoai", "DiaChi", "ChucVu", "TrangThai"];

const sanitizeCustomer = (customer) => {
  if (!customer) {
    return customer;
  }

  const { MatKhau, TokenDatLaiMatKhau, TokenDatLaiMatKhauHetHanLuc, TokenDatLaiMatKhauDaDungLuc, ...safeCustomer } = customer;

  return safeCustomer;
};

const sanitizeCustomerListResult = (result) => ({
  ...result,
  customers: result.customers.map(sanitizeCustomer),
});

const normalizeNumber = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? numericValue : null;
};

const buildCustomerSummary = (customer) => {
  const cars = Array.isArray(customer?.Xe) ? customer.Xe : [];
  const visits = [];
  let totalSpent = 0;
  let totalDebt = 0;

  cars.forEach((car) => {
    totalDebt += normalizeNumber(car?.TienNoHienTai) ?? 0;

    (car?.PhieuSuaChua ?? []).forEach((receipt) => {
      visits.push(receipt);
      totalSpent += normalizeNumber(receipt?.TongTien) ?? 0;
    });
  });

  const lastVisitSource = visits
    .map((receipt) => receipt?.NgaySC ?? receipt?.NgayTao)
    .map((value) => (value ? new Date(value) : null))
    .filter((value) => value instanceof Date && !Number.isNaN(value.getTime()))
    .sort((left, right) => right.getTime() - left.getTime())[0] ?? null;

  return {
    carsCount: cars.length,
    visitCount: visits.length,
    totalSpent,
    totalDebt,
    rank: totalSpent > 50000000 ? "VIP" : totalSpent > 10000000 ? "Thân thiết" : totalSpent > 0 ? "Thường xuyên" : "Mới",
    lastVisit: lastVisitSource,
  };
};

const mergeCustomerSummaries = (customer) => ({
  ...customer,
  ...buildCustomerSummary(customer),
});

const buildCustomerAvatarPath = (customerId) => `customers/${customerId}/avatar.webp`;

const createCustomerService = ({
  prismaClient = prisma,
  customerDelegate = prisma.kHACH_HANG,
  vehicleDelegate = prisma.xE,
  uploadPublicImage = uploadPublicImageUtil,
  removeObject = removeObjectUtil,
  processAvatarImage = processAvatarImageUtil,
  avatarBucket = process.env.SUPABASE_AVATAR_BUCKET || "avatars",
} = {}) => {
  const getCustomerOrThrow = async (id) => {
    const customer = await customerDelegate.findUnique({
      where: { MaKH: Number(id) },
      include: {
        Xe: {
          include: {
            HieuXe: true,
            PhieuSuaChua: true,
            PhieuThuTien: true
          }
        }
      }
    });

    if (!customer) {
      throw buildServiceError(404, "Không tìm thấy khách hàng.");
    }

    return customer;
  };

  const getCustomerList = async (query = {}) => {
    const { page = 1, limit = 10, search = "", ...filters } = query;
    const pagination = buildPagination({ page, limit });
    const { CongNoFrom, CongNoTo, BienSo, ...baseFilters } = filters;
    const where = buildListWhere({
      search,
      filters: baseFilters,
      searchFields: ["TenChuXe", "Email", "DienThoai", "DiaChi"],
      filterFields: CUSTOMER_FILTER_FIELDS,
    });

    if (BienSo?.trim()) {
      where.Xe = {
        some: {
          BienSo: {
            contains: BienSo.trim(),
          },
        },
      };
    }

    const minDebt = normalizeNumber(CongNoFrom);
    const maxDebt = normalizeNumber(CongNoTo);

    if (minDebt !== null || maxDebt !== null) {
      const vehicles = await vehicleDelegate.findMany({
        select: {
          MaKH: true,
          TienNoHienTai: true,
        },
      });

      const debtByCustomer = new Map();

      vehicles.forEach((vehicle) => {
        const customerId = Number(vehicle?.MaKH);
        const debt = normalizeNumber(vehicle?.TienNoHienTai) ?? 0;

        if (!Number.isFinite(customerId)) {
          return;
        }

        debtByCustomer.set(customerId, (debtByCustomer.get(customerId) ?? 0) + debt);
      });

      const filteredCustomerIds = Array.from(debtByCustomer.entries())
        .filter(([, debt]) => {
          if (minDebt !== null && debt < minDebt) {
            return false;
          }

          if (maxDebt !== null && debt > maxDebt) {
            return false;
          }

          return true;
        })
        .map(([customerId]) => customerId);

      where.MaKH = {
        in: filteredCustomerIds,
      };
    }

    const [totalItems, customers] = await runWithDbRetry(() => Promise.all([
      customerDelegate.count({ where }),
      customerDelegate.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: {
          MaKH: "desc",
        },
        include: {
          Xe: {
            select: {
              MaXe: true,
              BienSo: true,
              TienNoHienTai: true,
              PhieuSuaChua: {
                select: {
                  MaPhieuSC: true,
                  TongTien: true,
                  NgaySC: true,
                  NgayTao: true,
                },
              },
            },
          },
        },
      }),
    ]));

    const normalizedCustomers = customers.map(mergeCustomerSummaries);

    return sanitizeCustomerListResult({
      customers: normalizedCustomers,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pagination.limit),
      },
    });
  };

  const getCustomerById = async (id) => sanitizeCustomer(await getCustomerOrThrow(id));

  const createCustomer = async (payload, avatarFile) => {
    const createdCustomer = await customerDelegate.create({
      data: buildWriteData(payload, CUSTOMER_WRITE_FIELDS),
    });

    if (!avatarFile) {
      return sanitizeCustomer(createdCustomer);
    }

    const avatarPath = buildCustomerAvatarPath(createdCustomer.MaKH);

    try {
      const processedAvatar = await processAvatarImage(avatarFile);
      const avatarUrl = await uploadPublicImage({
        bucket: avatarBucket,
        path: avatarPath,
        buffer: processedAvatar.buffer,
        contentType: processedAvatar.contentType,
      });

      try {
        const updatedCustomer = await customerDelegate.update({
          where: { MaKH: createdCustomer.MaKH },
          data: { Avatar: avatarUrl },
        });

        return sanitizeCustomer(updatedCustomer);
      } catch (error) {
        await removeObject({ bucket: avatarBucket, path: avatarPath }).catch(() => {});
        await customerDelegate.delete({ where: { MaKH: createdCustomer.MaKH } }).catch(() => {});
        throw error;
      }
    } catch (error) {
      await customerDelegate.delete({ where: { MaKH: createdCustomer.MaKH } }).catch(() => {});
      throw error;
    }
  };

  const updateCustomer = async (id, payload, avatarFile) => {
    const customerId = Number(id);
    await getCustomerOrThrow(customerId);

    const writeData = buildWriteData(payload, CUSTOMER_WRITE_FIELDS);

    if (avatarFile) {
      const avatarPath = buildCustomerAvatarPath(customerId);
      const processedAvatar = await processAvatarImage(avatarFile);
      const avatarUrl = await uploadPublicImage({
        bucket: avatarBucket,
        path: avatarPath,
        buffer: processedAvatar.buffer,
        contentType: processedAvatar.contentType,
      });

      writeData.Avatar = avatarUrl;
    }

    const updatedCustomer = await customerDelegate.update({
      where: { MaKH: customerId },
      data: writeData,
    });

    return sanitizeCustomer(updatedCustomer);
  };

  const deleteCustomer = async (id) => {
    const customerId = Number(id);
    const customer = await getCustomerOrThrow(customerId);

    const relatedVehiclesCount = await vehicleDelegate.count({
      where: { MaKH: customerId },
    });

    if (relatedVehiclesCount > 0) {
      throw buildServiceError(409, "Không thể xóa khách hàng vì đang có dữ liệu liên quan.");
    }

    if (customer.Avatar) {
      const storageObject = resolveStorageObjectFromPublicUrl(customer.Avatar);

      await removeObject({
        bucket: storageObject.bucket,
        path: storageObject.path,
      });
    }

    const deletedCustomer = await customerDelegate.delete({
      where: { MaKH: customerId },
    });

    return sanitizeCustomer(deletedCustomer);
  };

  return {
    createCustomer,
    getCustomerList,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
  };
};

const customerService = createCustomerService();

export { createCustomerService, sanitizeCustomer, sanitizeCustomerListResult };
export default customerService;
