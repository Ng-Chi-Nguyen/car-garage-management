import prisma from "../../db/prisma.js";
import {
  buildRangeFromQuery,
  getVietnamDateParts,
} from "./reportDateRange.helpers.js";

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

const buildTimeseries = (repairOrders, granularity) => {
  const grouped = new Map();

  repairOrders.forEach((repairOrder) => {
    const label = getGranularityLabel(repairOrder.NgaySC, granularity);
    grouped.set(label, (grouped.get(label) ?? 0) + 1);
  });

  const items = Array.from(grouped.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([label, repairOrderCount]) => ({ label, repairOrderCount }));

  return {
    items,
    totalRepairOrders: items.reduce((sum, item) => sum + item.repairOrderCount, 0),
  };
};

const buildStatusBreakdown = (repairOrders) => {
  const statusToFieldMap = {
    TiepNhan: "receiving",
    DangSua: "inProgress",
    HoanTat: "completed",
    Huy: "cancelled",
  };
  const result = {
    receiving: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    total: repairOrders.length,
  };

  repairOrders.forEach((repairOrder) => {
    const targetField = statusToFieldMap[repairOrder.TrangThai];

    if (!targetField) {
      throw new Error(`TrangThai không hợp lệ: ${String(repairOrder.TrangThai)}`);
    }

    result[targetField] += 1;
  });

  return result;
};

const normalizeTechnicianId = (maNv) => {
  if (maNv === null || maNv === undefined) {
    return null;
  }

  const technicianId = Number(maNv);
  if (!Number.isFinite(technicianId)) {
    return null;
  }

  return technicianId;
};

const buildTopTechnician = (repairOrders) => {
  const grouped = new Map();

  repairOrders.forEach((repairOrder) => {
    const technicianId = normalizeTechnicianId(repairOrder.MaNV);
    if (technicianId === null) {
      return;
    }

    grouped.set(technicianId, (grouped.get(technicianId) ?? 0) + 1);
  });

  if (!grouped.size) {
    return null;
  }

  const [technicianId, repairOrderCount] = Array.from(grouped.entries()).sort((left, right) => {
    if (right[1] !== left[1]) {
      return right[1] - left[1];
    }

    return left[0] - right[0];
  })[0];

  return {
    technicianId,
    repairOrderCount,
  };
};

const createRepairReportService = ({
  db = prisma,
} = {}) => {
  return {
    getRepairSummary: async ({ from, to, granularity }) => {
      const range = buildRangeFromQuery({ from, to });
      const repairOrders = await db.pHIEU_SUA_CHUA.findMany({
        where: {
          NgaySC: {
            gte: range.start,
            lt: range.endExclusive,
          },
        },
        select: {
          NgaySC: true,
          TrangThai: true,
          MaNV: true,
        },
        orderBy: {
          NgaySC: "asc",
        },
      });

      return {
        range: {
          from,
          to,
          granularity,
        },
        timeseries: buildTimeseries(repairOrders, granularity),
        statusBreakdown: buildStatusBreakdown(repairOrders),
        topTechnician: buildTopTechnician(repairOrders),
      };
    },
  };
};

const repairReportService = createRepairReportService();

export { createRepairReportService };
export default repairReportService;
