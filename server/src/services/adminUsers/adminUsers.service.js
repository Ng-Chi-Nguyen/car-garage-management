const ALLOWED_ROLES = ["Admin", "NhanVien", "KhachHang"];
const ALLOWED_STATUSES = ["HoatDong", "BiKhoa", "DaXoa"];

const loadPrisma = async () => {
  const { default: prisma } = await import("../../db/prisma.js");
  return prisma;
};

const sanitizeUser = (user) => {
  if (!user) return user;

  const { MatKhau, TokenDatLaiMatKhau, TokenDatLaiMatKhauHetHanLuc, TokenDatLaiMatKhauDaDungLuc, ...safeUser } = user;
  return {
    ...safeUser,
    roleLabel:
      safeUser.ChucVu === "Admin" ? "Quản trị viên" : safeUser.ChucVu === "NhanVien" ? "Nhân viên" : "Khách hàng",
  };
};

export const createAdminUsersService = ({ userDelegate } = {}) => ({
  getAdminUsers: async (query = {}) => {
    const prisma = userDelegate ? null : await loadPrisma();
    const delegate = userDelegate ?? prisma.kHACH_HANG;
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const search = String(query.search ?? "");
    const role = String(query.role ?? "");
    const status = String(query.status ?? "");

    const where = {};

    if (search) {
      where.OR = [
        { TenChuXe: { contains: search } },
        { Email: { contains: search } },
        { DienThoai: { contains: search } },
      ];
    }

    if (role) {
      where.ChucVu = role;
    }

    if (status) {
      where.TrangThai = status;
    }

    const [totalItems, users] = await Promise.all([
      delegate.count({ where }),
      delegate.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { MaKH: "desc" },
      }),
    ]);

    return {
      users: users.map(sanitizeUser),
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / limit),
      },
    };
  },
  updateAdminUser: async (id, payload) => {
    const prisma = userDelegate ? null : await loadPrisma();
    const delegate = userDelegate ?? prisma.kHACH_HANG;
    const userId = Number(id);

    const existing = await delegate.findUnique({ where: { MaKH: userId } });
    if (!existing) {
      const error = new Error("Không tìm thấy tài khoản.");
      error.status = 404;
      throw error;
    }

    const data = {};
    if (payload.ChucVu && ALLOWED_ROLES.includes(payload.ChucVu)) data.ChucVu = payload.ChucVu;
    if (payload.TrangThai && ALLOWED_STATUSES.includes(payload.TrangThai)) data.TrangThai = payload.TrangThai;

    const updated = await delegate.update({ where: { MaKH: userId }, data });
    return sanitizeUser(updated);
  },
});

const adminUsersService = createAdminUsersService();

export { sanitizeUser };
export default adminUsersService;
