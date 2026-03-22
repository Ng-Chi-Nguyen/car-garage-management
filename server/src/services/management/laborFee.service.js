import createCrudService from "../../shared/crud/crud.serviceFactory.js";

const LABOR_FEE_FILTER_FIELDS = {
  MaTienCong: { type: "number" },
  NoiDung: { type: "string" },
  DonGia: { type: "decimal" },
};

const crudService = createCrudService({
  delegateName: "tIEN_CONG",
  idField: "MaTienCong",
  createFields: ["NoiDung", "DonGia"],
  searchFields: ["NoiDung"],
  filterFields: LABOR_FEE_FILTER_FIELDS,
  listKey: "laborFees",
  notFoundMessage: "Không tìm thấy tiền công.",
});

const laborFeeService = {
  createLaborFee: async (payload) => crudService.create(payload),
  getLaborFeeList: async (query) => crudService.getAll(query),
  getLaborFeeById: async (id) => crudService.getById(id),
  updateLaborFee: async (id, payload) => crudService.update(id, payload),
  deleteLaborFee: async (id) => crudService.remove(id),
};

export default laborFeeService;
