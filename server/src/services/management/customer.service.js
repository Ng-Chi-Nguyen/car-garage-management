import createCrudService from "../../shared/crud/crud.serviceFactory.js";

const sanitizeCustomer = (customer) => {
  if (!customer) {
    return customer;
  }

  const {
    MatKhau,
    TokenDatLaiMatKhau,
    TokenDatLaiMatKhauHetHanLuc,
    TokenDatLaiMatKhauDaDungLuc,
    ...safeCustomer
  } = customer;

  return safeCustomer;
};

const sanitizeCustomerListResult = (result) => ({
  ...result,
  customers: result.customers.map(sanitizeCustomer),
});

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

const crudService = createCrudService({
  delegateName: "kHACH_HANG",
  idField: "MaKH",
  createFields: ["Email", "TenChuXe", "DienThoai", "DiaChi", "ChucVu", "TrangThai", "Avatar"],
  searchFields: ["TenChuXe", "Email", "DienThoai", "DiaChi"],
  filterFields: CUSTOMER_FILTER_FIELDS,
  listKey: "customers",
  notFoundMessage: "Không tìm thấy khách hàng.",
});

const customerService = {
  createCustomer: async (payload) => sanitizeCustomer(await crudService.create(payload)),
  getCustomerList: async (query) => sanitizeCustomerListResult(await crudService.getAll(query)),
  getCustomerById: async (id) => sanitizeCustomer(await crudService.getById(id)),
  updateCustomer: async (id, payload) => sanitizeCustomer(await crudService.update(id, payload)),
  deleteCustomer: async (id) => sanitizeCustomer(await crudService.remove(id)),
};

export { sanitizeCustomer, sanitizeCustomerListResult };
export default customerService;
