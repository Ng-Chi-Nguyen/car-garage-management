import prisma from "../../db/prisma.js";

const VIETNAM_TIME_ZONE = "Asia/Ho_Chi_Minh";
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const VIETNAM_UTC_OFFSET_IN_MS = 7 * 60 * 60 * 1000;
const MAX_CARS_RECEIVE = 30;
const LOW_STOCK_THRESHOLD = 5;
const HIGH_DEBT_WARNING_THRESHOLD = 100_000_000;

const createUtcDateBoundaryFromVietnamCalendarDay = (year, month, day) =>
  new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0) - VIETNAM_UTC_OFFSET_IN_MS);

const getVietnamDateParts = (date) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: VIETNAM_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  );

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
  };
};

const buildSummaryRanges = (now) => {
  const { year, month, day } = getVietnamDateParts(now);
  const startOfToday = createUtcDateBoundaryFromVietnamCalendarDay(year, month, day);
  const startOfTomorrow = new Date(startOfToday.getTime() + ONE_DAY_IN_MS);
  const startOfCurrentMonth = createUtcDateBoundaryFromVietnamCalendarDay(year, month, 1);

  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const daysSinceMonday = (weekday + 6) % 7;
  const startOfCurrentWeekMonday = new Date(
    startOfToday.getTime() - daysSinceMonday * ONE_DAY_IN_MS,
  );

  return {
    startOfToday,
    startOfTomorrow,
    startOfCurrentWeekMonday,
    startOfCurrentMonth,
  };
};

const normalizeAggregateNumber = (value) => {
  if (value === null || value === undefined) {
    return 0;
  }

  const rawValue = typeof value === "number" ? value : value?.toString?.() ?? value;

  let numericValue;
  try {
    numericValue = Number(rawValue);
  } catch {
    throw new Error(`Invalid aggregate revenue value: ${String(rawValue)}`);
  }

  if (!Number.isFinite(numericValue)) {
    throw new Error(`Invalid aggregate revenue value: ${String(rawValue)}`);
  }

  return numericValue;
};

const sumRevenue = async (db, from, toExclusive) => {
  const result = await db.pHIEU_THU_TIEN.aggregate({
    _sum: {
      SoTienThu: true,
    },
    where: {
      TrangThai: "DaThu",
      NgayThu: {
        gte: from,
        lt: toExclusive,
      },
    },
  });

  return normalizeAggregateNumber(result?._sum?.SoTienThu);
};

const countTodayReceivedVehicles = async (db, from, toExclusive) => {
  return db.pHIEU_SUA_CHUA.count({
    where: {
      NgaySC: {
        gte: from,
        lt: toExclusive,
      },
    },
  });
};

const countActiveRepairOrders = async (db) => {
  return db.pHIEU_SUA_CHUA.count({
    where: {
      TrangThai: {
        in: ["TiepNhan", "DangSua"],
      },
    },
  });
};

const sumCollectedAmount = async (db) => {
  const result = await db.pHIEU_THU_TIEN.aggregate({
    _sum: {
      SoTienThu: true,
    },
    where: {
      TrangThai: "DaThu",
    },
  });

  return normalizeAggregateNumber(result?._sum?.SoTienThu);
};

const sumOutstandingDebt = async (db) => {
  const result = await db.xE.aggregate({
    _sum: {
      TienNoHienTai: true,
    },
    where: {
      TienNoHienTai: {
        gt: 0,
      },
    },
  });

  return normalizeAggregateNumber(result?._sum?.TienNoHienTai);
};

const countLowStockParts = async (db) => {
  return db.vAT_TU.count({
    where: {
      SoLuongTon: {
        lte: LOW_STOCK_THRESHOLD,
      },
    },
  });
};

const formatCurrencyVnd = (value) => `${new Intl.NumberFormat("vi-VN").format(value)}đ`;

const buildQuickAlerts = ({
  todayReceivedVehicles,
  totalOutstandingDebt,
  lowStockPartsCount,
}) => {
  const alerts = [];

  if (todayReceivedVehicles >= MAX_CARS_RECEIVE) {
    alerts.push({
      code: "OVER_CAPACITY",
      severity: "warning",
      title: "Vượt số xe tiếp nhận tối đa",
      message: `Hiện tại ${todayReceivedVehicles}/${MAX_CARS_RECEIVE} xe. Vui lòng kiểm tra lại công suất tiếp nhận.`,
    });
  }

  if (totalOutstandingDebt > HIGH_DEBT_WARNING_THRESHOLD) {
    alerts.push({
      code: "HIGH_DEBT",
      severity: "warning",
      title: "Công nợ cao",
      message: `Công nợ hiện tại ${formatCurrencyVnd(totalOutstandingDebt)}, cần theo dõi và thu hồi sớm.`,
    });
  }

  if (lowStockPartsCount > 0) {
    alerts.push({
      code: "LOW_STOCK",
      severity: "warning",
      title: "Vật tư tồn kho thấp",
      message: `Có ${lowStockPartsCount} vật tư/phụ tùng ở mức tồn kho thấp.`,
    });
  }

  return alerts;
};

const createDashboardService = ({
  db = prisma,
  nowProvider = () => new Date(),
} = {}) => {
  return {
    getRevenueSummary: async () => {
      const {
        startOfToday,
        startOfTomorrow,
        startOfCurrentWeekMonday,
        startOfCurrentMonth,
      } = buildSummaryRanges(nowProvider());

      const [
        todayRevenue,
        weekRevenue,
        monthRevenue,
        todayReceivedVehicles,
        activeRepairOrders,
        totalCollectedAmount,
        totalOutstandingDebt,
        lowStockPartsCount,
      ] = await Promise.all([
        sumRevenue(db, startOfToday, startOfTomorrow),
        sumRevenue(db, startOfCurrentWeekMonday, startOfTomorrow),
        sumRevenue(db, startOfCurrentMonth, startOfTomorrow),
        countTodayReceivedVehicles(db, startOfToday, startOfTomorrow),
        countActiveRepairOrders(db),
        sumCollectedAmount(db),
        sumOutstandingDebt(db),
        countLowStockParts(db),
      ]);

      const alerts = buildQuickAlerts({
        todayReceivedVehicles,
        totalOutstandingDebt,
        lowStockPartsCount,
      });

      return {
        summary: {
          todayRevenue,
          weekRevenue,
          monthRevenue,
          todayReceivedVehicles,
          activeRepairOrders,
          totalCollectedAmount,
          totalOutstandingDebt,
          lowStockPartsCount,
        },
        alerts,
      };
    },
  };
};

const dashboardService = createDashboardService();

export { createDashboardService };
export default dashboardService;
