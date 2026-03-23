import createCrudService from "../../shared/crud/crud.serviceFactory.js";

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
  createFields: ["Email", "MatKhau", "TenChuXe", "DienThoai", "DiaChi", "ChucVu", "TrangThai", "Avatar"],
  searchFields: ["TenChuXe", "Email", "DienThoai", "DiaChi"],
  filterFields: CUSTOMER_FILTER_FIELDS,
  listKey: "customers",
  notFoundMessage: "Không tìm thấy khách hàng.",
});

const customerService = {
  createCustomer: async (payload) => crudService.create(payload),
  getCustomerList: async (query) => crudService.getAll(query),
  getCustomerById: async (id) => crudService.getById(id),
  updateCustomer: async (id, payload) => crudService.update(id, payload),
  deleteCustomer: async (id) => crudService.remove(id),
};

export default customerService;
