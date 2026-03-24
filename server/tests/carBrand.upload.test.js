import test from "node:test";
import assert from "node:assert/strict";

const loadCreateCarBrandService = async () => {
  const module = await import("../src/services/management/carBrand.service.js");
  return module.createCarBrandService;
};

const createCarBrandDelegate = (initialCarBrand = null) => {
  let carBrand = initialCarBrand ? { ...initialCarBrand } : null;
  let createdId = initialCarBrand?.MaHieuXe ?? 1;

  return {
    async create({ data }) {
      carBrand = {
        MaHieuXe: ++createdId,
        Logo: null,
        ...data,
      };

      return { ...carBrand };
    },
    async update({ where, data }) {
      if (!carBrand || carBrand.MaHieuXe !== Number(where.MaHieuXe)) {
        const error = new Error("Không tìm thấy hiệu xe.");
        error.code = "P2025";
        throw error;
      }

      carBrand = {
        ...carBrand,
        ...data,
      };

      return { ...carBrand };
    },
    async delete({ where }) {
      if (!carBrand || carBrand.MaHieuXe !== Number(where.MaHieuXe)) {
        const error = new Error("Không tìm thấy hiệu xe.");
        error.code = "P2025";
        throw error;
      }

      const deleted = { ...carBrand };
      carBrand = null;
      return deleted;
    },
    async findUnique({ where }) {
      if (!carBrand) {
        return null;
      }

      if (where.MaHieuXe !== undefined) {
        return carBrand.MaHieuXe === Number(where.MaHieuXe) ? { ...carBrand } : null;
      }

      if (where.TenHieuXe !== undefined) {
        return carBrand.TenHieuXe === where.TenHieuXe ? { ...carBrand } : null;
      }

      return null;
    },
    async count() {
      return carBrand ? 1 : 0;
    },
    async findMany() {
      return carBrand ? [{ ...carBrand }] : [];
    },
  };
};

const createDependencies = (carBrandDelegate, overrides = {}) => {
  const uploaded = [];
  const removed = [];

  return {
    carBrandDelegate,
    vehicleDelegate: {
      count: async () => 0,
    },
    uploadPublicImage: async (payload) => {
      uploaded.push(payload);
      return `https://cdn.example.com/${payload.bucket}/${payload.path}`;
    },
    removeObject: async (payload) => {
      removed.push(payload);
    },
    processLogoImage: async (file) => ({
      buffer: file.buffer,
      contentType: "image/webp",
    }),
    getUploadedCalls: () => uploaded,
    getRemovedCalls: () => removed,
    ...overrides,
  };
};

test("carBrand create upload logo và lưu URL Supabase", async () => {
  const createCarBrandService = await loadCreateCarBrandService();
  const carBrandDelegate = createCarBrandDelegate();
  const dependencies = createDependencies(carBrandDelegate);
  const carBrandService = createCarBrandService(dependencies);

  const result = await carBrandService.createCarBrand(
    { TenHieuXe: "Toyota" },
    { buffer: Buffer.from("logo"), mimetype: "image/png" },
  );

  assert.equal(result.Logo, "https://cdn.example.com/car-brand-logos/car-brands/2/logo.webp");
  assert.equal(dependencies.getUploadedCalls()[0].bucket, "car-brand-logos");
  assert.equal(dependencies.getUploadedCalls()[0].path, "car-brands/2/logo.webp");
});

test("carBrand delete xóa file logo theo URL đã lưu", async () => {
  const createCarBrandService = await loadCreateCarBrandService();
  const carBrandDelegate = createCarBrandDelegate({
    MaHieuXe: 5,
    TenHieuXe: "Honda",
    Logo: "https://rudzqbtdrduwbtftiqmv.supabase.co/storage/v1/object/public/legacy-brand-logos/car-brands/5/logo.webp",
  });
  const dependencies = createDependencies(carBrandDelegate);
  const carBrandService = createCarBrandService(dependencies);

  await carBrandService.deleteCarBrand(5);

  assert.deepEqual(dependencies.getRemovedCalls()[0], {
    bucket: "legacy-brand-logos",
    path: "car-brands/5/logo.webp",
  });
});
