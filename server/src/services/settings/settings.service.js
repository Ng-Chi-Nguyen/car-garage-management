const SYSTEM_PARAMETER_DEFAULTS = {
  maxCarsPerDay: 20,
  materialProfitMargin: 15,
};

const DB_TIMEOUT_MESSAGE = "Hệ thống đang quá tải hoặc không thể kết nối cơ sở dữ liệu. Vui lòng thử lại sau.";

const wrapDbError = (error) => {
  const message = String(error?.message ?? "").toLowerCase();

  if (message.includes("pool timeout") || message.includes("unable to start a transaction in the given time")) {
    const wrappedError = new Error(DB_TIMEOUT_MESSAGE);
    wrappedError.status = 503;
    return wrappedError;
  }

  return error;
};

const resolveDelegate = (prisma, candidates, errorMessage) => {
  const delegate = candidates.map((candidate) => prisma?.[candidate]).find((candidate) => candidate && typeof candidate.findUnique === "function");

  if (!delegate) {
    const error = new Error(errorMessage);
    error.status = 500;
    throw error;
  }

  return delegate;
};

const toParametersDto = (setting) => ({
  maxCarsPerDay: setting.SoXeToiDaMoiNgay,
  materialProfitMargin: setting.TyLeLoiNhuanPhuTung,
});

const toServicePriceDto = (servicePrice) => ({
  id: servicePrice.MaTienCong,
  name: servicePrice.NoiDung,
  duration: servicePrice.ThoiLuong ?? null,
  price: Number(servicePrice.DonGia),
});

const loadPrisma = async () => {
  const { default: prisma } = await import("../../db/prisma.js");
  return prisma;
};

export const createSettingsService = ({ prisma: injectedPrisma, settingsDelegate, laborFeeDelegate, carBrandDelegate, repairOrderDetailDelegate } = {}) => ({
  getSystemParameters: async () => {
    const prisma = settingsDelegate ? null : (injectedPrisma ?? await loadPrisma());
    const delegate = settingsDelegate ?? resolveDelegate(prisma, ["cAU_HINH_HE_THONG", "CAU_HINH_HE_THONG", "cauHinhHeThong"], "Không tìm thấy model cấu hình hệ thống trong Prisma client.");

    let setting;

    try {
      setting = await delegate.findUnique({ where: { MaCauHinh: 1 } });
    } catch (error) {
      throw wrapDbError(error);
    }

    if (!setting) {
      return { ...SYSTEM_PARAMETER_DEFAULTS };
    }

    return toParametersDto(setting);
  },
  updateSystemParameters: async (payload) => {
    const prisma = settingsDelegate ? null : (injectedPrisma ?? await loadPrisma());
    const delegate = settingsDelegate ?? resolveDelegate(prisma, ["cAU_HINH_HE_THONG", "CAU_HINH_HE_THONG", "cauHinhHeThong"], "Không tìm thấy model cấu hình hệ thống trong Prisma client.");

    let setting;

    try {
      setting = await delegate.upsert({
        where: { MaCauHinh: 1 },
        create: {
          MaCauHinh: 1,
          SoXeToiDaMoiNgay: payload.maxCarsPerDay,
          TyLeLoiNhuanPhuTung: payload.materialProfitMargin,
        },
        update: {
          SoXeToiDaMoiNgay: payload.maxCarsPerDay,
          TyLeLoiNhuanPhuTung: payload.materialProfitMargin,
        },
      });
    } catch (error) {
      throw wrapDbError(error);
    }

    return toParametersDto(setting);
  },
  getServicePrices: async () => {
    const prisma = laborFeeDelegate ? null : (injectedPrisma ?? await loadPrisma());
    const delegate = laborFeeDelegate ?? prisma.tIEN_CONG;
    let servicePrices;

    try {
      servicePrices = await delegate.findMany({
        orderBy: { MaTienCong: "asc" },
      });
    } catch (error) {
      throw wrapDbError(error);
    }

    return servicePrices.map((servicePrice) => toServicePriceDto(servicePrice));
  },
  createServicePrice: async (payload) => {
    const prisma = laborFeeDelegate ? null : (injectedPrisma ?? await loadPrisma());
    const delegate = laborFeeDelegate ?? prisma.tIEN_CONG;

    let created;

    try {
      created = await delegate.create({
        data: {
          NoiDung: payload.name,
          DonGia: payload.price,
        },
      });
    } catch (error) {
      throw wrapDbError(error);
    }

    return toServicePriceDto(created);
  },
  updateServicePrice: async (id, payload) => {
    const prisma = laborFeeDelegate ? null : (injectedPrisma ?? await loadPrisma());
    const delegate = laborFeeDelegate ?? prisma.tIEN_CONG;

    let updated;

    try {
      updated = await delegate.update({
        where: {
          MaTienCong: Number(id),
        },
        data: {
          NoiDung: payload.name,
          DonGia: payload.price,
        },
      });
    } catch (error) {
      if (error?.code === "P2025") {
        const missingError = new Error("Không tìm thấy hạng mục tiền công.");
        missingError.status = 404;
        throw missingError;
      }

      throw wrapDbError(error);
    }

    return toServicePriceDto(updated);
  },
  deleteServicePrice: async (id) => {
    const prisma = laborFeeDelegate ? null : (injectedPrisma ?? await loadPrisma());
    const delegate = laborFeeDelegate ?? prisma.tIEN_CONG;
    const repairOrderDetailRepo = repairOrderDetailDelegate ?? prisma.cT_PHIEU_SUA_CHUA;

    const servicePriceId = Number(id);
    let relatedCount = 0;

    try {
      relatedCount = await repairOrderDetailRepo.count({
        where: {
          MaTienCong: servicePriceId,
        },
      });
    } catch (error) {
      throw wrapDbError(error);
    }

    if (relatedCount > 0) {
      const conflictError = new Error("Không thể xóa hạng mục tiền công vì đã phát sinh dữ liệu sửa chữa liên quan.");
      conflictError.status = 409;
      throw conflictError;
    }

    try {
      await delegate.delete({
        where: {
          MaTienCong: servicePriceId,
        },
      });
    } catch (error) {
      if (error?.code === "P2025") {
        const missingError = new Error("Không tìm thấy hạng mục tiền công.");
        missingError.status = 404;
        throw missingError;
      }

      throw wrapDbError(error);
    }

    return {
      id: servicePriceId,
      deleted: true,
    };
  },
  getCarBrands: async () => {
    const prisma = carBrandDelegate ? null : (injectedPrisma ?? await loadPrisma());
    const delegate = carBrandDelegate ?? prisma.hIEU_XE;
    let carBrands;

    try {
      carBrands = await delegate.findMany({
        include: {
          _count: {
            select: {
              Xe: true,
            },
          },
        },
        orderBy: { MaHieuXe: "asc" },
      });
    } catch (error) {
      throw wrapDbError(error);
    }

    return carBrands.map((carBrand) => ({
      id: carBrand.MaHieuXe,
      name: carBrand.TenHieuXe,
      modelCount: carBrand._count?.Xe ?? carBrand.Xe?.length ?? 0,
      description: carBrand.description ?? carBrand.GhiChu ?? carBrand.TenHieuXe,
    }));
  },
});

const settingsService = createSettingsService();

export default settingsService;
