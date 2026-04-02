const SYSTEM_PARAMETER_DEFAULTS = {
  maxCarsPerDay: 20,
  materialProfitMargin: 15,
};

const toParametersDto = (setting) => ({
  maxCarsPerDay: setting.SoXeToiDaMoiNgay,
  materialProfitMargin: setting.TyLeLoiNhuanPhuTung,
});

const loadPrisma = async () => {
  const { default: prisma } = await import("../../db/prisma.js");
  return prisma;
};

export const createSettingsService = ({ settingsDelegate, laborFeeDelegate, carBrandDelegate } = {}) => ({
  getSystemParameters: async () => {
    const prisma = settingsDelegate ? null : await loadPrisma();
    const delegate = settingsDelegate ?? prisma.cAU_HINH_HE_THONG;
    const setting = await delegate.findUnique({ where: { MaCauHinh: 1 } });

    if (!setting) {
      return { ...SYSTEM_PARAMETER_DEFAULTS };
    }

    return toParametersDto(setting);
  },
  updateSystemParameters: async (payload) => {
    const prisma = settingsDelegate ? null : await loadPrisma();
    const delegate = settingsDelegate ?? prisma.cAU_HINH_HE_THONG;
    const setting = await delegate.upsert({
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

    return toParametersDto(setting);
  },
  getServicePrices: async () => {
    const prisma = laborFeeDelegate ? null : await loadPrisma();
    const delegate = laborFeeDelegate ?? prisma.tIEN_CONG;
    const servicePrices = await delegate.findMany({
      orderBy: { MaTienCong: "asc" },
    });

    return servicePrices.map((servicePrice) => ({
      id: servicePrice.MaTienCong,
      name: servicePrice.NoiDung,
      duration: servicePrice.ThoiLuong ?? null,
      price: Number(servicePrice.DonGia),
    }));
  },
  getCarBrands: async () => {
    const prisma = carBrandDelegate ? null : await loadPrisma();
    const delegate = carBrandDelegate ?? prisma.hIEU_XE;
    const carBrands = await delegate.findMany({
      include: {
        _count: {
          select: {
            Xe: true,
          },
        },
      },
      orderBy: { MaHieuXe: "asc" },
    });

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
