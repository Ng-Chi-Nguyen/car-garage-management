import createCrudService from "../../shared/crud/crud.serviceFactory.js";

const SUPPLIER_FILTER_FIELDS = {
  MaNCC: { type: "number" },
  TenNCC: { type: "string" },
  DienThoai: { type: "string" },
  Email: { type: "string" },
  NguoiLienHe: { type: "string" },
  DiaChi: { type: "string" },
};

const crudService = createCrudService({
  delegateName: "nHA_CUNG_CAP",
  idField: "MaNCC",
  createFields: ["TenNCC", "DienThoai", "Email", "NguoiLienHe", "DiaChi"],
  searchFields: ["TenNCC", "DienThoai", "Email", "NguoiLienHe", "DiaChi"],
  filterFields: SUPPLIER_FILTER_FIELDS,
  listKey: "suppliers",
  notFoundMessage: "Không tìm thấy nhà cung cấp.",
});

const supplierService = {
  createSupplier: async (payload) => crudService.create(payload),
  getSupplierList: async (query) => crudService.getAll(query),
  getSupplierById: async (id) => crudService.getById(id),
  updateSupplier: async (id, payload) => crudService.update(id, payload),
  deleteSupplier: async (id) => crudService.remove(id),
};

export default supplierService;
