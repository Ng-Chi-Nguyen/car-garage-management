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
