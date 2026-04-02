const ACTIVITY_LIMIT = 20;

const loadPrisma = async () => {
  const { default: prisma } = await import("../../db/prisma.js");
  return prisma;
};

const formatActivityTime = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
};

const buildInitials = (value) => {
  const parts = String(value ?? "")
    .trim()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?";
};

const toActivityLog = ({ id, time, user, role, actionType, details, status }) => ({
  id: String(id),
  time,
  user,
  initials: buildInitials(user),
  role,
  actionType,
  details,
  status,
  statusLabel: status === "error" ? "Thất bại" : "Thành công",
});

const buildActivityLogs = ({ repairOrders, paymentReceipts, stockReceipts, customers }) => {
  const logs = [
    ...repairOrders.map((repairOrder) => toActivityLog({
      id: `repair-${repairOrder.MaPhieuSC}`,
      time: formatActivityTime(repairOrder.NgayCapNhat ?? repairOrder.NgayTao),
      user: repairOrder.MaNV ? `Nhân viên #${repairOrder.MaNV}` : "Hệ thống",
      role: repairOrder.MaNV ? "Nhân viên" : "Hệ thống",
      actionType: `Phiếu sửa chữa #${repairOrder.MaPhieuSC}`,
      details: `Xe #${repairOrder.MaXe} - trạng thái ${repairOrder.TrangThai}`,
      status: repairOrder.TrangThai === "Huy" ? "error" : "success",
    })),
    ...paymentReceipts.map((paymentReceipt) => toActivityLog({
      id: `payment-${paymentReceipt.MaPhieuThu}`,
      time: formatActivityTime(paymentReceipt.NgayCapNhat ?? paymentReceipt.NgayTao),
      user: paymentReceipt.MaNV ? `Nhân viên #${paymentReceipt.MaNV}` : "Hệ thống",
      role: paymentReceipt.MaNV ? "Nhân viên" : "Hệ thống",
      actionType: `Phiếu thu #${paymentReceipt.MaPhieuThu}`,
      details: `Xe #${paymentReceipt.MaXe} - ${Number(paymentReceipt.SoTienThu).toLocaleString()} VNĐ`,
      status: paymentReceipt.TrangThai === "Huy" ? "error" : "success",
    })),
    ...stockReceipts.map((stockReceipt) => toActivityLog({
      id: `stock-${stockReceipt.MaPhieuNhap}`,
      time: formatActivityTime(stockReceipt.NgayNhap),
      user: `Nhà cung cấp #${stockReceipt.MaNCC}`,
      role: "Kho",
      actionType: `Phiếu nhập kho #${stockReceipt.MaPhieuNhap}`,
      details: `Tổng tiền ${Number(stockReceipt.TongTien).toLocaleString()} VNĐ`,
      status: "success",
    })),
    ...customers.map((customer) => toActivityLog({
      id: `customer-${customer.MaKH}`,
      time: formatActivityTime(customer.NgayCapNhat ?? customer.NgayTao),
      user: customer.TenChuXe,
      role: "Khách hàng",
      actionType: `Khách hàng #${customer.MaKH}`,
      details: `Cập nhật số điện thoại ${customer.DienThoai}`,
      status: "success",
    })),
  ]
    .filter((activity) => activity.time)
    .sort((left, right) => String(right.time).localeCompare(String(left.time)))
    .slice(0, ACTIVITY_LIMIT);

  return logs;
};

const buildActivityStats = (logs) => ({
  totalActions: logs.length,
  trend: "+0.0%",
  activeUsers: new Set(logs.map((log) => log.user)).size,
  errors: logs.filter((log) => log.status === "error").length,
  successRate: logs.length ? `${Math.round(((logs.filter((log) => log.status === "success").length / logs.length) * 100) * 10) / 10}%` : "0%",
});

export const createActivityService = ({ repairOrderDelegate, paymentReceiptDelegate, stockReceiptDelegate, customerDelegate } = {}) => ({
  getActivityLogs: async () => {
    const prisma = repairOrderDelegate || paymentReceiptDelegate || stockReceiptDelegate || customerDelegate ? null : await loadPrisma();
    const repairOrderRepo = repairOrderDelegate ?? prisma.pHIEU_SUA_CHUA;
    const paymentReceiptRepo = paymentReceiptDelegate ?? prisma.pHIEU_THU_TIEN;
    const stockReceiptRepo = stockReceiptDelegate ?? prisma.pHIEU_NHAP_KHO;
    const customerRepo = customerDelegate ?? prisma.kHACH_HANG;
    const [repairOrders, paymentReceipts, stockReceipts, customers] = await Promise.all([
      repairOrderRepo.findMany({ orderBy: { NgayCapNhat: "desc" }, take: ACTIVITY_LIMIT }),
      paymentReceiptRepo.findMany({ orderBy: { NgayCapNhat: "desc" }, take: ACTIVITY_LIMIT }),
      stockReceiptRepo.findMany({ orderBy: { NgayNhap: "desc" }, take: ACTIVITY_LIMIT }),
      customerRepo.findMany({ orderBy: { NgayCapNhat: "desc" }, take: ACTIVITY_LIMIT }),
    ]);

    return buildActivityLogs({ repairOrders, paymentReceipts, stockReceipts, customers });
  },
  getActivityStats: async () => {
    const service = createActivityService({ repairOrderDelegate, paymentReceiptDelegate, stockReceiptDelegate, customerDelegate });
    const logs = await service.getActivityLogs();
    return buildActivityStats(logs);
  },
});

const activityService = createActivityService();

export default activityService;
