import prisma from "../../db/prisma.js";
import {
  ONE_DAY_IN_MS,
  buildRangeFromQuery,
  getVietnamDateParts,
  parseDateString,
} from "./reportDateRange.helpers.js";

const formatDateParts = ({ year, month, day }) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const formatVietnamDateKey = (date) => formatDateParts(getVietnamDateParts(date));

const shiftDateStringByDays = (dateString, dayDelta) => {
  const { year, month, day } = parseDateString(dateString);
  const shiftedDate = new Date(Date.UTC(year, month - 1, day + dayDelta));

  return formatDateParts({
    year: shiftedDate.getUTCFullYear(),
    month: shiftedDate.getUTCMonth() + 1,
    day: shiftedDate.getUTCDate(),
  });
};

const shiftDateStringByYears = (dateString, yearDelta) => {
  const { year, month, day } = parseDateString(dateString);
  const targetYear = year + yearDelta;
  const lastDayOfTargetMonth = new Date(Date.UTC(targetYear, month, 0)).getUTCDate();
  const safeDay = Math.min(day, lastDayOfTargetMonth);
  const shiftedDate = new Date(Date.UTC(targetYear, month - 1, safeDay));

  return formatDateParts({
    year: shiftedDate.getUTCFullYear(),
    month: shiftedDate.getUTCMonth() + 1,
    day: shiftedDate.getUTCDate(),
  });
};

const normalizeNumber = (value) => {
  if (value === null || value === undefined) {
    return 0;
  }

  const rawValue = typeof value === "number" ? value : value?.toString?.() ?? value;
  const numericValue = Number(rawValue);

  if (!Number.isFinite(numericValue)) {
    throw new Error(`Invalid numeric value: ${String(rawValue)}`);
  }

  return numericValue;
};

const toRatio = (revenue, totalRevenue) => {
  if (!totalRevenue) {
    return 0;
  }

  return Number((revenue / totalRevenue).toFixed(4));
};

const sortItemsByRevenueDesc = (items) =>
  [...items].sort((left, right) => {
    if (right.revenue !== left.revenue) {
      return right.revenue - left.revenue;
    }

    return String(left.label ?? left.partName ?? left.carBrandName).localeCompare(
      String(right.label ?? right.partName ?? right.carBrandName),
      "vi",
    );
  });

const getGranularityLabel = (date, granularity) => {
  const { year, month, day } = getVietnamDateParts(date);

  if (granularity === "year") {
    return String(year);
  }

  if (granularity === "month") {
    return `${year}-${String(month).padStart(2, "0")}`;
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

const fetchPaidReceipts = async (db, range, includeVehicleBrand = false) => {
  return db.pHIEU_THU_TIEN.findMany({
    where: {
      TrangThai: "DaThu",
      NgayThu: {
        gte: range.start,
        lt: range.endExclusive,
      },
    },
    include: includeVehicleBrand
      ? {
          Xe: {
            include: {
              HieuXe: true,
            },
          },
        }
      : undefined,
    orderBy: {
      NgayThu: "asc",
    },
  });
};

const fetchRepairDetails = async (db, range) => {
  return db.cT_PHIEU_SUA_CHUA.findMany({
    where: {
      PhieuSuaChua: {
        NgaySC: {
          gte: range.start,
          lt: range.endExclusive,
        },
      },
    },
    include: {
      VatTu: true,
    },
  });
};

const sumRevenueFromReceipts = (receipts) =>
  receipts.reduce((total, receipt) => total + normalizeNumber(receipt.SoTienThu), 0);

const buildRevenueTimeseries = (receipts, granularity) => {
  const grouped = new Map();

  receipts.forEach((receipt) => {
    const key = getGranularityLabel(receipt.NgayThu, granularity);
    grouped.set(key, (grouped.get(key) ?? 0) + normalizeNumber(receipt.SoTienThu));
  });

  return Array.from(grouped.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([label, revenue]) => ({ label, revenue }));
};

const buildRevenueByCarBrand = (receipts) => {
  const grouped = new Map();

  receipts.forEach((receipt) => {
    const brand = receipt.Xe?.HieuXe;
    const carBrandId = brand?.MaHieuXe ?? 0;
    const carBrandName = brand?.TenHieuXe ?? "Không rõ";
    const current = grouped.get(carBrandId) ?? {
      carBrandId,
      carBrandName,
      revenue: 0,
    };

    current.revenue += normalizeNumber(receipt.SoTienThu);
    grouped.set(carBrandId, current);
  });

  const items = sortItemsByRevenueDesc(Array.from(grouped.values()));
  const totalRevenue = items.reduce((sum, item) => sum + item.revenue, 0);

  return {
    items: items.map((item) => ({
      ...item,
      ratio: toRatio(item.revenue, totalRevenue),
    })),
    totalRevenue,
  };
};

const buildRevenueByPart = (repairDetails) => {
  const grouped = new Map();

  repairDetails.forEach((detail) => {
    const partRevenue = normalizeNumber(detail.SoLuong) * normalizeNumber(detail.DonGiaVatTu);
    const partId = detail.MaVatTu;
    const partName = detail.VatTu?.TenVatTu ?? `Vật tư ${partId}`;
    const current = grouped.get(partId) ?? {
      partId,
      partName,
      revenue: 0,
    };

    current.revenue += partRevenue;
    grouped.set(partId, current);
  });

  const items = sortItemsByRevenueDesc(Array.from(grouped.values()));
  const totalRevenue = items.reduce((sum, item) => sum + item.revenue, 0);

  return {
    items: items.map((item) => ({
      ...item,
      ratio: toRatio(item.revenue, totalRevenue),
    })),
    totalRevenue,
  };
};

const buildOtherRevenueGroup = (repairDetails) => {
  const totalRevenue = repairDetails.reduce(
    (sum, detail) => sum + normalizeNumber(detail.DonGiaTienCong),
    0,
  );

  return {
    totalRevenue,
    items: totalRevenue
      ? [
          {
            key: "labor",
            label: "Tiền công / dịch vụ khác",
            revenue: totalRevenue,
            ratio: 1,
          },
        ]
      : [],
  };
};

const createRevenueReportService = ({
  db = prisma,
} = {}) => {
  return {
    getRevenueTimeseries: async ({ granularity, from, to }) => {
      const range = buildRangeFromQuery({ from, to });
      const receipts = await fetchPaidReceipts(db, range);
      const items = buildRevenueTimeseries(receipts, granularity);

      return {
        range: { from, to, granularity },
        items,
        totalRevenue: items.reduce((sum, item) => sum + item.revenue, 0),
      };
    },

    getRevenueByCarBrand: async ({ from, to }) => {
      const range = buildRangeFromQuery({ from, to });
      const receipts = await fetchPaidReceipts(db, range, true);
      const { items, totalRevenue } = buildRevenueByCarBrand(receipts);

      return {
        range: { from, to },
        items,
        totalRevenue,
      };
    },

    getRevenueByPart: async ({ from, to }) => {
      const range = buildRangeFromQuery({ from, to });
      const repairDetails = await fetchRepairDetails(db, range);
      const { items, totalRevenue } = buildRevenueByPart(repairDetails);

      return {
        range: { from, to },
        items,
        totalRevenue,
      };
    },

    getRevenueComparison: async ({ from, to }) => {
      const currentRange = buildRangeFromQuery({ from, to });
      const daySpan = Math.round(
        (currentRange.endExclusive.getTime() - currentRange.start.getTime()) / ONE_DAY_IN_MS,
      );
      const previousFrom = shiftDateStringByDays(from, -daySpan);
      const previousTo = shiftDateStringByDays(from, -1);
      const lastYearFrom = shiftDateStringByYears(from, -1);
      const lastYearTo = shiftDateStringByYears(to, -1);

      const [currentReceipts, previousReceipts, lastYearReceipts] = await Promise.all([
        fetchPaidReceipts(db, currentRange),
        fetchPaidReceipts(db, buildRangeFromQuery({ from: previousFrom, to: previousTo })),
        fetchPaidReceipts(db, buildRangeFromQuery({ from: lastYearFrom, to: lastYearTo })),
      ]);

      const currentRevenue = sumRevenueFromReceipts(currentReceipts);
      const previousRevenue = sumRevenueFromReceipts(previousReceipts);
      const lastYearRevenue = sumRevenueFromReceipts(lastYearReceipts);

      return {
        currentPeriod: {
          from,
          to,
          revenue: currentRevenue,
        },
        previousPeriod: {
          from: previousFrom,
          to: previousTo,
          revenue: previousRevenue,
        },
        samePeriodLastYear: {
          from: lastYearFrom,
          to: lastYearTo,
          revenue: lastYearRevenue,
        },
        deltaPrevious: currentRevenue - previousRevenue,
        deltaPreviousPercent: toRatio(currentRevenue - previousRevenue, previousRevenue),
        deltaLastYear: currentRevenue - lastYearRevenue,
        deltaLastYearPercent: toRatio(currentRevenue - lastYearRevenue, lastYearRevenue),
      };
    },

    getRevenueComposition: async ({ from, to }) => {
      const range = buildRangeFromQuery({ from, to });
      const [receipts, repairDetails] = await Promise.all([
        fetchPaidReceipts(db, range, true),
        fetchRepairDetails(db, range),
      ]);

      const carBrandGroup = buildRevenueByCarBrand(receipts);
      const partGroup = buildRevenueByPart(repairDetails);
      const otherGroup = buildOtherRevenueGroup(repairDetails);

      return {
        range: { from, to },
        groups: [
          {
            key: "carBrand",
            label: "Hiệu xe",
            totalRevenue: carBrandGroup.totalRevenue,
            items: carBrandGroup.items.map((item) => ({
              key: item.carBrandId,
              label: item.carBrandName,
              revenue: item.revenue,
              ratio: item.ratio,
            })),
          },
          {
            key: "part",
            label: "Phụ tùng",
            totalRevenue: partGroup.totalRevenue,
            items: partGroup.items.map((item) => ({
              key: item.partId,
              label: item.partName,
              revenue: item.revenue,
              ratio: item.ratio,
            })),
          },
          {
            key: "other",
            label: "Khác",
            totalRevenue: otherGroup.totalRevenue,
            items: otherGroup.items,
          },
        ],
      };
    },
  };
};

const revenueReportService = createRevenueReportService();

export { createRevenueReportService, formatVietnamDateKey };
export default revenueReportService;
