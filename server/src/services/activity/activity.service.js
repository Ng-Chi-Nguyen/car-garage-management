import { buildPagination, normalizeKeyword } from "../../shared/crud/crud.helpers.js";

const ACTIVITY_SOURCE_LIMIT = 300;
const DB_TIMEOUT_MESSAGE = "Hệ thống đang quá tải hoặc không thể kết nối cơ sở dữ liệu. Vui lòng thử lại sau.";

const PERIOD_VALUES = new Set(["today", "7days", "30days", "all"]);
const STATUS_LABELS = {
  success: "Thành công",
  warning: "Đang xử lý",
  error: "Thất bại",
};

const ACTION_META = {
  repair_order: { label: "Phiếu sửa chữa", icon: "build" },
  payment_receipt: { label: "Thu tiền", icon: "payments" },
  stock_receipt: { label: "Nhập kho", icon: "inventory_2" },
  customer_profile: { label: "Cập nhật khách hàng", icon: "person" },
};

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "success", label: STATUS_LABELS.success },
  { value: "warning", label: STATUS_LABELS.warning },
  { value: "error", label: STATUS_LABELS.error },
];

const ROLE_LABELS = {
  Admin: "Admin",
  NhanVien: "Nhân viên",
  KhachHang: "Khách hàng",
};

const wrapDbError = (error) => {
  const message = String(error?.message ?? "").toLowerCase();

  if (message.includes("pool timeout") || message.includes("unable to start a transaction in the given time")) {
    const wrappedError = new Error(DB_TIMEOUT_MESSAGE);
    wrappedError.status = 503;
    return wrappedError;
  }

  return error;
};

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

  return (
    parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
};

const parseDate = (value, { endOfDay = false } = {}) => {
  if (!value) {
    return null;
  }

  const rawValue = String(value).trim();

  if (!rawValue) {
    return null;
  }

  const date = new Date(rawValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const isDateOnlyString = /^\d{4}-\d{2}-\d{2}$/.test(rawValue);

  if (!isDateOnlyString) {
    return date;
  }

  if (endOfDay) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }

  return date;
};

const getPeriodRange = (period, nowProvider) => {
  const now = nowProvider();

  if (period === "all") {
    return { from: null, to: null };
  }

  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  if (period === "7days") {
    start.setDate(start.getDate() - 6);
  }

  if (period === "30days") {
    start.setDate(start.getDate() - 29);
  }

  return { from: start, to: end };
};

const resolveDateRange = ({ period, fromDate, toDate }, nowProvider) => {
  const fallbackPeriod = PERIOD_VALUES.has(period) ? period : "today";
  const periodRange = getPeriodRange(fallbackPeriod, nowProvider);
  const parsedFromDate = parseDate(fromDate, { endOfDay: false });
  const parsedToDate = parseDate(toDate, { endOfDay: true });

  const resolvedFrom = parsedFromDate ?? periodRange.from;
  const resolvedTo = parsedToDate ?? periodRange.to;

  if (resolvedFrom && resolvedTo && resolvedFrom > resolvedTo) {
    return { from: resolvedTo, to: resolvedFrom };
  }

  return { from: resolvedFrom, to: resolvedTo };
};

const buildRangeWhere = (field, range) => {
  const where = {};

  if (range.from) {
    where.gte = range.from;
  }

  if (range.to) {
    where.lte = range.to;
  }

  if (Object.keys(where).length === 0) {
    return {};
  }

  return {
    [field]: where,
  };
};

const formatMoney = (value) => `${Number(value ?? 0).toLocaleString("vi-VN")} VNĐ`;

const toActivityLog = ({ id, time, user, role, actionTypeKey, details, status, actorKey }) => {
  const actionMeta = ACTION_META[actionTypeKey] ?? {
    label: actionTypeKey,
    icon: "history",
  };

  return {
    id: String(id),
    time,
    user,
    initials: buildInitials(user),
    role,
    actionType: actionMeta.label,
    actionTypeKey,
    actionIcon: actionMeta.icon,
    details,
    status,
    statusLabel: STATUS_LABELS[status] ?? STATUS_LABELS.success,
    actorKey,
  };
};

const resolveRoleLabel = (role) => ROLE_LABELS[role] ?? role ?? "Nội bộ";

const buildDatasetFilters = (logs, query) => {
  const normalizedSearch = normalizeKeyword(query.search);

  return logs.filter((log) => {
    if (query.user !== "all" && log.actorKey !== query.user) {
      return false;
    }

    if (query.actionType !== "all" && log.actionTypeKey !== query.actionType) {
      return false;
    }

    if (query.status !== "all" && log.status !== query.status) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    const haystack = normalizeKeyword([
      log.user,
      log.role,
      log.actionType,
      log.details,
      log.statusLabel,
    ].join(" "));

    return haystack.includes(normalizedSearch);
  });
};

const buildUserOptions = (logs) => {
  const options = new Map();

  logs.forEach((log) => {
    if (!log.actorKey || options.has(log.actorKey)) {
      return;
    }

    options.set(log.actorKey, {
      value: log.actorKey,
      label: `${log.user} (${log.role})`,
    });
  });

  return [
    { value: "all", label: "Tất cả người thực hiện" },
    ...Array.from(options.values()).sort((left, right) => left.label.localeCompare(right.label, "vi")),
  ];
};

const buildActionTypeOptions = (logs) => {
  const availableActionKeys = new Set(logs.map((log) => log.actionTypeKey));
  const actionOptions = Object.entries(ACTION_META)
    .filter(([key]) => availableActionKeys.has(key))
    .map(([key, meta]) => ({ value: key, label: meta.label }));

  return [{ value: "all", label: "Tất cả loại" }, ...actionOptions];
};

const buildActivityStats = (logs) => {
  const successCount = logs.filter((log) => log.status === "success").length;
  const errorCount = logs.filter((log) => log.status === "error").length;

  return {
    totalActions: logs.length,
    trend: "+0.0%",
    activeUsers: new Set(logs.map((log) => log.actorKey)).size,
    errors: errorCount,
    successRate: logs.length ? `${Math.round((successCount / logs.length) * 1000) / 10}%` : "0%",
  };
};

const normalizeActivityQuery = (query = {}) => {
  const normalizedPeriod = PERIOD_VALUES.has(query.period) ? query.period : "today";
  const page = Number(query.page);
  const limit = Number(query.limit);

  return {
    page: Number.isInteger(page) && page > 0 ? page : 1,
    limit: Number.isInteger(limit) && limit > 0 ? limit : 10,
    period: normalizedPeriod,
    user: String(query.user ?? "all") || "all",
    actionType: String(query.actionType ?? "all") || "all",
    status: String(query.status ?? "all") || "all",
    search: String(query.search ?? ""),
    fromDate: query.fromDate,
    toDate: query.toDate,
  };
};

const resolveStaffName = (staffMap, staffId) => {
  if (!staffId) {
    return { user: "Hệ thống", role: "Hệ thống", actorKey: "system" };
  }

  const staff = staffMap.get(Number(staffId));

  if (!staff) {
    return {
      user: `Nhân viên #${staffId}`,
      role: "Nhân viên",
      actorKey: `staff:${staffId}`,
    };
  }

  return {
    user: staff.TenChuXe,
    role: resolveRoleLabel(staff.ChucVu),
    actorKey: `staff:${staff.MaKH}`,
  };
};

const buildActivityLogs = ({ repairOrders, paymentReceipts, stockReceipts, customers, staffMap, supplierMap }) => {
  const logs = [
    ...repairOrders.map((repairOrder) => {
      const actor = resolveStaffName(staffMap, repairOrder.MaNV);
      const status = repairOrder.TrangThai === "Huy"
        ? "error"
        : (repairOrder.TrangThai === "DangSua" || repairOrder.TrangThai === "TiepNhan")
          ? "warning"
          : "success";

      return toActivityLog({
        id: `repair-${repairOrder.MaPhieuSC}`,
        time: formatActivityTime(repairOrder.NgayCapNhat ?? repairOrder.NgayTao),
        user: actor.user,
        role: actor.role,
        actionTypeKey: "repair_order",
        details: `Phiếu #${repairOrder.MaPhieuSC} · Xe #${repairOrder.MaXe} · ${repairOrder.NoiDungLoi ?? repairOrder.GhiChu ?? "Cập nhật trạng thái"}`,
        status,
        actorKey: actor.actorKey,
      });
    }),
    ...paymentReceipts.map((paymentReceipt) => {
      const actor = resolveStaffName(staffMap, paymentReceipt.MaNV);
      const status = paymentReceipt.TrangThai === "Huy"
        ? "error"
        : paymentReceipt.TrangThai === "ChoXacNhan"
          ? "warning"
          : "success";

      return toActivityLog({
        id: `payment-${paymentReceipt.MaPhieuThu}`,
        time: formatActivityTime(paymentReceipt.NgayCapNhat ?? paymentReceipt.NgayTao),
        user: actor.user,
        role: actor.role,
        actionTypeKey: "payment_receipt",
        details: `Phiếu #${paymentReceipt.MaPhieuThu} · Xe #${paymentReceipt.MaXe} · Thu ${formatMoney(paymentReceipt.SoTienThu)}`,
        status,
        actorKey: actor.actorKey,
      });
    }),
    ...stockReceipts.map((stockReceipt) => {
      const supplier = supplierMap.get(stockReceipt.MaNCC);
      const supplierName = supplier?.TenNCC ?? `Nhà cung cấp #${stockReceipt.MaNCC}`;

      return toActivityLog({
        id: `stock-${stockReceipt.MaPhieuNhap}`,
        time: formatActivityTime(stockReceipt.NgayNhap),
        user: supplierName,
        role: "Kho",
        actionTypeKey: "stock_receipt",
        details: `Phiếu #${stockReceipt.MaPhieuNhap} · Tổng nhập ${formatMoney(stockReceipt.TongTien)}`,
        status: "success",
        actorKey: `supplier:${stockReceipt.MaNCC}`,
      });
    }),
    ...customers.map((customer) => toActivityLog({
      id: `customer-${customer.MaKH}`,
      time: formatActivityTime(customer.NgayCapNhat ?? customer.NgayTao),
      user: customer.TenChuXe,
      role: "Khách hàng",
      actionTypeKey: "customer_profile",
      details: `Khách hàng #${customer.MaKH} · ${customer.DienThoai}`,
      status: "success",
      actorKey: `customer:${customer.MaKH}`,
    })),
  ]
    .filter((activity) => activity.time)
    .sort((left, right) => String(right.time).localeCompare(String(left.time)));

  return logs;
};

export const createActivityService = ({
  repairOrderDelegate,
  paymentReceiptDelegate,
  stockReceiptDelegate,
  customerDelegate,
  staffDelegate,
  supplierDelegate,
  now = () => new Date(),
} = {}) => ({
  getActivityLogs: async (query = {}) => {
    const normalizedQuery = normalizeActivityQuery(query);
    const range = resolveDateRange(normalizedQuery, now);
    const pagination = buildPagination({ page: normalizedQuery.page, limit: normalizedQuery.limit });

    const hasDelegates =
      repairOrderDelegate ||
      paymentReceiptDelegate ||
      stockReceiptDelegate ||
      customerDelegate ||
      staffDelegate ||
      supplierDelegate;
    const prisma = hasDelegates ? null : await loadPrisma();

    const emptyRepo = {
      findMany: async () => [],
    };

    const repairOrderRepo = repairOrderDelegate ?? prisma?.pHIEU_SUA_CHUA ?? emptyRepo;
    const paymentReceiptRepo = paymentReceiptDelegate ?? prisma?.pHIEU_THU_TIEN ?? emptyRepo;
    const stockReceiptRepo = stockReceiptDelegate ?? prisma?.pHIEU_NHAP_KHO ?? emptyRepo;
    const customerRepo = customerDelegate ?? prisma?.kHACH_HANG ?? emptyRepo;
    const staffRepo = staffDelegate ?? prisma?.kHACH_HANG ?? emptyRepo;
    const supplierRepo = supplierDelegate ?? prisma?.nHA_CUNG_CAP ?? emptyRepo;

    let repairOrders;
    let paymentReceipts;
    let stockReceipts;
    let customers;

    try {
      [repairOrders, paymentReceipts, stockReceipts, customers] = await Promise.all([
        repairOrderRepo.findMany({
          where: buildRangeWhere("NgayCapNhat", range),
          orderBy: { NgayCapNhat: "desc" },
          take: ACTIVITY_SOURCE_LIMIT,
        }),
        paymentReceiptRepo.findMany({
          where: buildRangeWhere("NgayCapNhat", range),
          orderBy: { NgayCapNhat: "desc" },
          take: ACTIVITY_SOURCE_LIMIT,
        }),
        stockReceiptRepo.findMany({
          where: buildRangeWhere("NgayNhap", range),
          orderBy: { NgayNhap: "desc" },
          take: ACTIVITY_SOURCE_LIMIT,
        }),
        customerRepo.findMany({
          where: buildRangeWhere("NgayCapNhat", range),
          orderBy: { NgayCapNhat: "desc" },
          take: ACTIVITY_SOURCE_LIMIT,
        }),
      ]);
    } catch (error) {
      throw wrapDbError(error);
    }

    const staffIds = Array.from(new Set([
      ...repairOrders.map((item) => item.MaNV).filter(Boolean),
      ...paymentReceipts.map((item) => item.MaNV).filter(Boolean),
    ]));
    const supplierIds = Array.from(new Set(stockReceipts.map((item) => item.MaNCC).filter(Boolean)));

    let staffRecords = [];
    let supplierRecords = [];

    try {
      [staffRecords, supplierRecords] = await Promise.all([
        staffIds.length > 0
          ? staffRepo.findMany({
            where: { MaKH: { in: staffIds } },
            select: { MaKH: true, TenChuXe: true, ChucVu: true },
          })
          : [],
        supplierIds.length > 0
          ? supplierRepo.findMany({
            where: { MaNCC: { in: supplierIds } },
            select: { MaNCC: true, TenNCC: true },
          })
          : [],
      ]);
    } catch (error) {
      throw wrapDbError(error);
    }

    const staffMap = new Map(staffRecords.map((item) => [item.MaKH, item]));
    const supplierMap = new Map(supplierRecords.map((item) => [item.MaNCC, item]));

    const allLogs = buildActivityLogs({
      repairOrders,
      paymentReceipts,
      stockReceipts,
      customers,
      staffMap,
      supplierMap,
    });
    const filteredLogs = buildDatasetFilters(allLogs, normalizedQuery);
    const totalItems = filteredLogs.length;
    const activityLogs = filteredLogs.slice(pagination.skip, pagination.skip + pagination.limit);

    return {
      activityLogs,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pagination.limit),
      },
      filters: {
        period: normalizedQuery.period,
        user: normalizedQuery.user,
        actionType: normalizedQuery.actionType,
        status: normalizedQuery.status,
        search: normalizedQuery.search,
        userOptions: buildUserOptions(allLogs),
        actionTypeOptions: buildActionTypeOptions(allLogs),
        statusOptions: STATUS_OPTIONS,
      },
    };
  },
  getActivityStats: async (query = {}) => {
    const normalizedQuery = normalizeActivityQuery(query);
    const service = createActivityService({
      repairOrderDelegate,
      paymentReceiptDelegate,
      stockReceiptDelegate,
      customerDelegate,
      staffDelegate,
      supplierDelegate,
      now,
    });
    const { activityLogs } = await service.getActivityLogs({
      ...normalizedQuery,
      page: 1,
      limit: ACTIVITY_SOURCE_LIMIT * 4,
    });

    return buildActivityStats(activityLogs);
  },
});

const activityService = createActivityService();

export default activityService;
