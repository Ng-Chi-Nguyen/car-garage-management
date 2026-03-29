import prisma from "../../db/prisma.js";
import {
  buildRangeFromQuery,
  createUtcDateBoundaryFromVietnamCalendarDay,
  getVietnamDateParts,
} from "./reportDateRange.helpers.js";

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

const buildCollectedAmountTimeseries = (receipts, granularity) => {
  const grouped = new Map();

  receipts.forEach((receipt) => {
    const label = getGranularityLabel(receipt.NgayThu, granularity);
    grouped.set(label, (grouped.get(label) ?? 0) + normalizeNumber(receipt.SoTienThu));
  });

  const items = Array.from(grouped.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([label, collectedAmount]) => ({ label, collectedAmount }));

  return {
    granularity,
    items,
    totalCollectedAmount: items.reduce((sum, item) => sum + item.collectedAmount, 0),
  };
};

const buildPagination = (page, limit, totalItems) => ({
  page,
  limit,
  totalItems,
  totalPages: totalItems > 0 ? Math.ceil(totalItems / limit) : 0,
});

const buildCurrentVietnamMonthRange = (now) => {
  const { year, month } = getVietnamDateParts(now);
  const start = createUtcDateBoundaryFromVietnamCalendarDay(year, month, 1);
  const nextMonthStart = month === 12
    ? createUtcDateBoundaryFromVietnamCalendarDay(year + 1, 1, 1)
    : createUtcDateBoundaryFromVietnamCalendarDay(year, month + 1, 1);

  return {
    start,
    endExclusive: nextMonthStart,
  };
};

const buildVehicleDebtorWhere = (search) => {
  const trimmedSearch = search?.trim?.() ?? "";

  if (!trimmedSearch) {
    return {
      TienNoHienTai: {
        gt: 0,
      },
    };
  }

  return {
    TienNoHienTai: {
      gt: 0,
    },
    OR: [
      {
        BienSo: {
          contains: trimmedSearch,
        },
      },
      {
        KhachHang: {
          TenChuXe: {
            contains: trimmedSearch,
          },
        },
      },
      {
        KhachHang: {
          DienThoai: {
            contains: trimmedSearch,
          },
        },
      },
    ],
  };
};

const buildCustomerDebtorWhere = (search) => {
  const trimmedSearch = search?.trim?.() ?? "";

  return {
    ...(trimmedSearch
      ? {
          OR: [
            {
              TenChuXe: {
                contains: trimmedSearch,
              },
            },
            {
              DienThoai: {
                contains: trimmedSearch,
              },
            },
          ],
        }
      : {}),
    Xe: {
      some: {
        TienNoHienTai: {
          gt: 0,
        },
      },
    },
  };
};

const mapVehicleDebtor = (vehicle) => ({
  vehicleId: vehicle.MaXe,
  licensePlate: vehicle.BienSo,
  customerId: vehicle.KhachHang?.MaKH ?? null,
  customerName: vehicle.KhachHang?.TenChuXe ?? null,
  phoneNumber: vehicle.KhachHang?.DienThoai ?? null,
  outstandingDebt: normalizeNumber(vehicle.TienNoHienTai),
});

const mapCustomerDebtor = (customer) => {
  const indebtedVehicles = (customer.Xe ?? []).filter(
    (vehicle) => normalizeNumber(vehicle.TienNoHienTai) > 0,
  );

  return {
    customerId: customer.MaKH,
    customerName: customer.TenChuXe,
    phoneNumber: customer.DienThoai,
    vehicleCount: indebtedVehicles.length,
    outstandingDebt: indebtedVehicles.reduce(
      (sum, vehicle) => sum + normalizeNumber(vehicle.TienNoHienTai),
      0,
    ),
  };
};

const sortCustomerDebtors = (items) =>
  [...items].sort((left, right) => {
    if (right.outstandingDebt !== left.outstandingDebt) {
      return right.outstandingDebt - left.outstandingDebt;
    }

    return left.customerId - right.customerId;
  });

const createFinanceReportService = ({
  db = prisma,
  nowProvider = () => new Date(),
} = {}) => {
  return {
    getFinanceSummary: async ({ from, to, granularity }) => {
      const queryRange = buildRangeFromQuery({ from, to });
      const currentMonthRange = buildCurrentVietnamMonthRange(nowProvider());

      const [debtAggregate, receipts, newDebtAggregate] = await Promise.all([
        db.xE.aggregate({
          _sum: {
            TienNoHienTai: true,
          },
          where: {
            TienNoHienTai: {
              gt: 0,
            },
          },
        }),
        db.pHIEU_THU_TIEN.findMany({
          where: {
            TrangThai: "DaThu",
            NgayThu: {
              gte: queryRange.start,
              lt: queryRange.endExclusive,
            },
          },
          select: {
            NgayThu: true,
            SoTienThu: true,
          },
          orderBy: {
            NgayThu: "asc",
          },
        }),
        db.pHIEU_SUA_CHUA.aggregate({
          _sum: {
            TongTien: true,
          },
          where: {
            NgaySC: {
              gte: currentMonthRange.start,
              lt: currentMonthRange.endExclusive,
            },
          },
        }),
      ]);

      return {
        range: { from, to, granularity },
        totalOutstandingDebt: normalizeNumber(debtAggregate?._sum?.TienNoHienTai),
        collectedAmountTimeseries: buildCollectedAmountTimeseries(receipts, granularity),
        newDebtInCurrentMonth: normalizeNumber(newDebtAggregate?._sum?.TongTien),
      };
    },

    getFinanceDebtors: async ({ page, limit, search, groupBy }) => {
      if (groupBy === "customer") {
        const customers = await db.kHACH_HANG.findMany({
          where: buildCustomerDebtorWhere(search),
          select: {
            MaKH: true,
            TenChuXe: true,
            DienThoai: true,
            Xe: {
              where: {
                TienNoHienTai: {
                  gt: 0,
                },
              },
              select: {
                MaXe: true,
                TienNoHienTai: true,
              },
            },
          },
        });

        const aggregatedItems = sortCustomerDebtors(
          customers.map(mapCustomerDebtor).filter((item) => item.outstandingDebt > 0),
        );
        const totalItems = aggregatedItems.length;
        const startIndex = (page - 1) * limit;

        return {
          items: aggregatedItems.slice(startIndex, startIndex + limit),
          pagination: buildPagination(page, limit, totalItems),
        };
      }

      const where = buildVehicleDebtorWhere(search);
      const [totalItems, vehicles] = await Promise.all([
        db.xE.count({ where }),
        db.xE.findMany({
          where,
          select: {
            MaXe: true,
            BienSo: true,
            TienNoHienTai: true,
            KhachHang: {
              select: {
                MaKH: true,
                TenChuXe: true,
                DienThoai: true,
              },
            },
          },
          orderBy: [{ TienNoHienTai: "desc" }, { MaXe: "asc" }],
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      return {
        items: vehicles.map(mapVehicleDebtor),
        pagination: buildPagination(page, limit, totalItems),
      };
    },
  };
};

const financeReportService = createFinanceReportService();

export { createFinanceReportService, buildCurrentVietnamMonthRange, buildCollectedAmountTimeseries };
export default financeReportService;
