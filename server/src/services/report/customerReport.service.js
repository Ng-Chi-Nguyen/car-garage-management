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

const normalizeNumber = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  const rawValue = typeof value === "number" ? value : value?.toString?.() ?? value;
  const numericValue = Number(rawValue);

  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return numericValue;
};

const normalizeCustomerId = (value) => {
  const id = normalizeNumber(value);

  if (id === null || !Number.isInteger(id)) {
    return null;
  }

  return id;
};

const selectTopCustomer = (grouped, totalField) => {
  if (!grouped.size) {
    return null;
  }

  const [customerId, data] = Array.from(grouped.entries()).sort((left, right) => {
    if (right[1].total !== left[1].total) {
      return right[1].total - left[1].total;
    }

    return left[0] - right[0];
  })[0];

  return {
    customerId,
    customerName: data.customerName,
    [totalField]: data.total,
  };
};

const buildNewCustomersTimeseries = (customers, granularity) => {
  const grouped = new Map();

  customers.forEach((customer) => {
    const createdAt = customer?.NgayTao;
    if (!(createdAt instanceof Date) || Number.isNaN(createdAt.getTime())) {
      return;
    }

    const label = getGranularityLabel(createdAt, granularity);
    grouped.set(label, (grouped.get(label) ?? 0) + 1);
  });

  const items = Array.from(grouped.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([label, newCustomers]) => ({ label, newCustomers }));

  return {
    items,
    totalNewCustomers: items.reduce((sum, item) => sum + item.newCustomers, 0),
  };
};

const buildTopRevenueCustomer = (receipts) => {
  const grouped = new Map();

  receipts.forEach((receipt) => {
    const customer = receipt?.Xe?.KhachHang;
    const customerId = normalizeCustomerId(customer?.MaKH);
    const totalRevenue = normalizeNumber(receipt?.SoTienThu);

    if (customerId === null || !customer?.TenChuXe || totalRevenue === null) {
      return;
    }

    const current = grouped.get(customerId) ?? {
      customerName: customer.TenChuXe,
      total: 0,
    };

    current.total += totalRevenue;
    grouped.set(customerId, current);
  });

  return selectTopCustomer(grouped, "totalRevenue");
};

const buildTopDebtCustomer = (cars) => {
  const grouped = new Map();

  cars.forEach((car) => {
    const customer = car?.KhachHang;
    const customerId = normalizeCustomerId(customer?.MaKH);
    const totalDebt = normalizeNumber(car?.TienNoHienTai);

    if (customerId === null || !customer?.TenChuXe || totalDebt === null || totalDebt <= 0) {
      return;
    }

    const current = grouped.get(customerId) ?? {
      customerName: customer.TenChuXe,
      total: 0,
    };

    current.total += totalDebt;
    grouped.set(customerId, current);
  });

  return selectTopCustomer(grouped, "totalDebt");
};

const createCustomerReportService = ({
  db = prisma,
} = {}) => {
  return {
    getCustomerSummary: async ({ from, to, granularity }) => {
      const range = buildRangeFromQuery({ from, to });
      const [customers, receipts, cars] = await Promise.all([
        db.kHACH_HANG.findMany({
          where: {
            NgayTao: {
              gte: range.start,
              lt: range.endExclusive,
            },
          },
          select: {
            NgayTao: true,
          },
          orderBy: {
            NgayTao: "asc",
          },
        }),
        db.pHIEU_THU_TIEN.findMany({
          where: {
            TrangThai: "DaThu",
            NgayThu: {
              gte: range.start,
              lt: range.endExclusive,
            },
          },
          select: {
            SoTienThu: true,
            Xe: {
              select: {
                KhachHang: {
                  select: {
                    MaKH: true,
                    TenChuXe: true,
                  },
                },
              },
            },
          },
        }),
        db.xE.findMany({
          select: {
            TienNoHienTai: true,
            KhachHang: {
              select: {
                MaKH: true,
                TenChuXe: true,
              },
            },
          },
        }),
      ]);

      return {
        newCustomersTimeseries: buildNewCustomersTimeseries(customers, granularity),
        topRevenueCustomer: buildTopRevenueCustomer(receipts),
        topDebtCustomer: buildTopDebtCustomer(cars),
      };
    },
  };
};

const customerReportService = createCustomerReportService();

export { createCustomerReportService };
export default customerReportService;
