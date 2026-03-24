import prisma from "../../db/prisma.js";
import {
  buildListWhere,
  buildPagination,
  buildServiceError,
  buildWriteData,
} from "../../shared/crud/crud.helpers.js";
import { processLogoImage as processLogoImageUtil } from "../../utils/image.util.js";
import {
  removeObject as removeObjectUtil,
  resolveStorageObjectFromPublicUrl,
  uploadPublicImage as uploadPublicImageUtil,
} from "../../utils/supabase.storage.js";

const CAR_BRAND_FILTER_FIELDS = {
  MaHieuXe: { type: "number" },
  TenHieuXe: { type: "string" },
};

const CAR_BRAND_WRITE_FIELDS = ["TenHieuXe"];

const buildCarBrandLogoPath = (carBrandId) => `car-brands/${carBrandId}/logo.webp`;

const createCarBrandService = ({
  prismaClient = prisma,
  carBrandDelegate = prisma.hIEU_XE,
  vehicleDelegate = prisma.xE,
  uploadPublicImage = uploadPublicImageUtil,
  removeObject = removeObjectUtil,
  processLogoImage = processLogoImageUtil,
  logoBucket = process.env.SUPABASE_CAR_BRAND_LOGO_BUCKET || "car-brand-logos",
} = {}) => {
  const getCarBrandOrThrow = async (id) => {
    const carBrand = await carBrandDelegate.findUnique({
      where: { MaHieuXe: Number(id) },
    });

    if (!carBrand) {
      throw buildServiceError(404, "Không tìm thấy hiệu xe.");
    }

    return carBrand;
  };

  const createCarBrand = async (payload, logoFile) => {
    const createdCarBrand = await carBrandDelegate.create({
      data: buildWriteData(payload, CAR_BRAND_WRITE_FIELDS),
    });

    if (!logoFile) {
      return createdCarBrand;
    }

    const logoPath = buildCarBrandLogoPath(createdCarBrand.MaHieuXe);

    try {
      const processedLogo = await processLogoImage(logoFile);
      const logoUrl = await uploadPublicImage({
        bucket: logoBucket,
        path: logoPath,
        buffer: processedLogo.buffer,
        contentType: processedLogo.contentType,
      });

      try {
        return await carBrandDelegate.update({
          where: { MaHieuXe: createdCarBrand.MaHieuXe },
          data: { Logo: logoUrl },
        });
      } catch (error) {
        await removeObject({ bucket: logoBucket, path: logoPath }).catch(() => {});
        await carBrandDelegate.delete({ where: { MaHieuXe: createdCarBrand.MaHieuXe } }).catch(() => {});
        throw error;
      }
    } catch (error) {
      await carBrandDelegate.delete({ where: { MaHieuXe: createdCarBrand.MaHieuXe } }).catch(() => {});
      throw error;
    }
  };

  const getCarBrandList = async (query = {}) => {
    const { page = 1, limit = 10, search = "", ...filters } = query;
    const pagination = buildPagination({ page, limit });
    const where = buildListWhere({
      search,
      filters,
      searchFields: ["TenHieuXe"],
      filterFields: CAR_BRAND_FILTER_FIELDS,
    });

    const [totalItems, carBrands] = await prismaClient.$transaction([
      carBrandDelegate.count({ where }),
      carBrandDelegate.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: {
          MaHieuXe: "desc",
        },
      }),
    ]);

    return {
      carBrands,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pagination.limit),
      },
    };
  };

  const getCarBrandById = async (id) => getCarBrandOrThrow(id);

  const updateCarBrand = async (id, payload, logoFile) => {
    const carBrandId = Number(id);
    await getCarBrandOrThrow(carBrandId);

    const writeData = buildWriteData(payload, CAR_BRAND_WRITE_FIELDS);

    if (logoFile) {
      const logoPath = buildCarBrandLogoPath(carBrandId);
      const processedLogo = await processLogoImage(logoFile);
      const logoUrl = await uploadPublicImage({
        bucket: logoBucket,
        path: logoPath,
        buffer: processedLogo.buffer,
        contentType: processedLogo.contentType,
      });

      writeData.Logo = logoUrl;
    }

    return carBrandDelegate.update({
      where: { MaHieuXe: carBrandId },
      data: writeData,
    });
  };

  const deleteCarBrand = async (id) => {
    const carBrandId = Number(id);
    const carBrand = await getCarBrandOrThrow(carBrandId);

    const relatedVehiclesCount = await vehicleDelegate.count({
      where: { MaHieuXe: carBrandId },
    });

    if (relatedVehiclesCount > 0) {
      throw buildServiceError(409, "Không thể xóa hiệu xe vì đang có dữ liệu liên quan.");
    }

    if (carBrand.Logo) {
      const storageObject = resolveStorageObjectFromPublicUrl(carBrand.Logo);

      await removeObject({
        bucket: storageObject.bucket,
        path: storageObject.path,
      });
    }

    const deletedCarBrand = await carBrandDelegate.delete({
      where: { MaHieuXe: carBrandId },
    });

    return deletedCarBrand;
  };

  return {
    createCarBrand,
    getCarBrandList,
    getCarBrandById,
    updateCarBrand,
    deleteCarBrand,
  };
};

const carBrandService = createCarBrandService();

export { createCarBrandService };
export default carBrandService;
