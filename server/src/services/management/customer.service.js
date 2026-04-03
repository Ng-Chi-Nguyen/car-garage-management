import prisma from "../../db/prisma.js";
import {
  buildListWhere,
  buildPagination,
  runWithDbRetry,
  buildServiceError,
  buildWriteData,
} from "../../shared/crud/crud.helpers.js";
import { buildCurrentVietnamMonthRange } from "../report/financeReport.service.js";

const CUSTOMER_FILTER_FIELDS = {
  MaKH: { type: "number" },
  Email: { type: "string" },
  TenChuXe: { type: "string" },
  DienThoai: { type: "string" },
  DiaChi: { type: "string" },
  ChucVu: { type: "enum", values: ["NhanVien", "KhachHang"] },
  TrangThai: { type: "enum", values: ["HoatDong", "BiKhoa", "DaXoa"], multi: true },
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

const buildCustomerAvatarPath = (customerId) => `customers/${customerId}/avatar.webp`;

const loadAvatarHelpers = async () => {
  const [{ processAvatarImage }, { removeObject, resolveStorageObjectFromPublicUrl, uploadPublicImage }] = await Promise.all([
    import("../../utils/image.util.js"),
    import("../../utils/supabase.storage.js"),
  ]);

  return {
    processAvatarImage,
    removeObject,
    resolveStorageObjectFromPublicUrl,
    uploadPublicImage,
  };
};

const createCustomerService = ({
  prismaClient = prisma,
  customerDelegate = prisma.kHACH_HANG,
  vehicleDelegate = prisma.xE,
  avatarBucket = process.env.SUPABASE_AVATAR_BUCKET || "avatars",
  nowProvider = () => new Date(),
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
    const where = buildListWhere({
      search,
      filters,
      searchFields: ["TenChuXe", "Email", "DienThoai", "DiaChi"],
      filterFields: CUSTOMER_FILTER_FIELDS,
    });

    const [totalItems, customers] = await runWithDbRetry(() => Promise.all([
      customerDelegate.count({ where }),
      customerDelegate.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: {
          MaKH: "desc",
        },
      }),
    ]));

    return sanitizeCustomerListResult({
      customers,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pagination.limit),
      },
    });
  };

  const getCustomerStats = async () => {
    const currentMonthRange = buildCurrentVietnamMonthRange(nowProvider());

    const [totalCustomers, customers, debtAggregate, monthlyRepairOrders] = await Promise.all([
      customerDelegate.count({
        where: {
          ChucVu: "KhachHang",
          TrangThai: {
            not: "DaXoa",
          },
        },
      }),
      customerDelegate.findMany({
        where: {
          ChucVu: "KhachHang",
          TrangThai: {
            not: "DaXoa",
          },
        },
        select: {
          Xe: {
            select: {
              TienNoHienTai: true,
              PhieuSuaChua: {
                select: {
                  TongTien: true,
                },
              },
            },
          },
        },
      }),
      prismaClient.xE.aggregate({
        where: {
          TienNoHienTai: {
            gt: 0,
          },
        },
        _sum: {
          TienNoHienTai: true,
        },
      }),
      prismaClient.pHIEU_SUA_CHUA.count({
        where: {
          NgaySC: {
            gte: currentMonthRange.start,
            lt: currentMonthRange.endExclusive,
          },
        },
      }),
    ]);

    const vipCustomers = customers.reduce((count, customer) => {
      const totalSpent = (customer.Xe ?? []).reduce(
        (vehicleSum, vehicle) => vehicleSum + (vehicle.PhieuSuaChua ?? []).reduce(
          (repairSum, repairOrder) => repairSum + Number(repairOrder.TongTien ?? 0),
          0,
        ),
        0,
      );

      return count + (totalSpent > 50000000 ? 1 : 0);
    }, 0);

    return {
      totalCustomers,
      vipCustomers,
      totalOutstandingDebt: Number(debtAggregate?._sum?.TienNoHienTai ?? 0),
      monthlyRepairOrders,
    };
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
      const { processAvatarImage, uploadPublicImage } = await loadAvatarHelpers();
      const processedAvatar = await processAvatarImage(avatarFile);
      const avatarUrl = await uploadPublicImage({
        bucket: avatarBucket,
        path: avatarPath,
        buffer: processedAvatar.buffer,
        contentType: processedAvatar.contentType,
      });

      try {
        const { removeObject } = await loadAvatarHelpers();
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
      const { processAvatarImage, uploadPublicImage } = await loadAvatarHelpers();
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
      const { removeObject, resolveStorageObjectFromPublicUrl } = await loadAvatarHelpers();
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
    getCustomerStats,
  };
};

const customerService = createCustomerService();

export { createCustomerService, sanitizeCustomer, sanitizeCustomerListResult };
export default customerService;
