import createCrudService from "../../shared/crud/crud.serviceFactory.js";

const CAR_BRAND_FILTER_FIELDS = {
  MaHieuXe: { type: "number" },
  TenHieuXe: { type: "string" },
};

const crudService = createCrudService({
  delegateName: "hIEU_XE",
  idField: "MaHieuXe",
  createFields: ["TenHieuXe"],
  searchFields: ["TenHieuXe"],
  filterFields: CAR_BRAND_FILTER_FIELDS,
  listKey: "carBrands",
  notFoundMessage: "Không tìm thấy hiệu xe.",
});

const carBrandService = {
  createCarBrand: async (payload) => crudService.create(payload),
  getCarBrandList: async (query) => crudService.getAll(query),
  getCarBrandById: async (id) => crudService.getById(id),
  updateCarBrand: async (id, payload) => crudService.update(id, payload),
  deleteCarBrand: async (id) => crudService.remove(id),
};

export default carBrandService;
