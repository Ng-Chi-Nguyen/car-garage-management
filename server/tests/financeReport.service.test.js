import test from "node:test";
import assert from "node:assert/strict";

const ensureTestDatabaseUrl = () => {
  process.env.DATABASE_URL ??= "mysql://tester:secret@127.0.0.1:3306/garage_test";
};

const loadCreateFinanceReportService = async () => {
  ensureTestDatabaseUrl();
  const module = await import("../src/services/report/financeReport.service.js");
  return module.createFinanceReportService;
};

const createDecimalLike = (value) => ({
  toString: () => String(value),
});

const createDbStub = ({
  debtAggregateImpl = async () => ({ _sum: { TienNoHienTai: 0 } }),
  receiptFindManyImpl = async () => [],
  repairAggregateImpl = async () => ({ _sum: { TongTien: 0 } }),
  vehicleCountImpl = async () => 0,
  vehicleFindManyImpl = async () => [],
  customerFindManyImpl = async () => [],
} = {}) => ({
  xE: {
    aggregate: debtAggregateImpl,
    count: vehicleCountImpl,
    findMany: vehicleFindManyImpl,
  },
  pHIEU_THU_TIEN: {
    findMany: receiptFindManyImpl,
  },
  pHIEU_SUA_CHUA: {
    aggregate: repairAggregateImpl,
  },
  kHACH_HANG: {
    findMany: customerFindManyImpl,
  },
});

test("service getFinanceSummary tra tong no, timeseries thu tien va no moi trong thang", async () => {
  const createFinanceReportService = await loadCreateFinanceReportService();
  const db = createDbStub({
    debtAggregateImpl: async () => ({
      _sum: { TienNoHienTai: createDecimalLike(12500000) },
    }),
    receiptFindManyImpl: async () => [
      {
        NgayThu: new Date("2026-03-05T00:00:00.000Z"),
        SoTienThu: createDecimalLike(1000000),
      },
      {
        NgayThu: new Date("2026-03-05T12:00:00.000Z"),
        SoTienThu: createDecimalLike(500000),
      },
      {
        NgayThu: new Date("2026-03-06T00:00:00.000Z"),
        SoTienThu: createDecimalLike(750000),
      },
    ],
    repairAggregateImpl: async () => ({
      _sum: { TongTien: createDecimalLike(3200000) },
    }),
  });

  const service = createFinanceReportService({
    db,
    nowProvider: () => new Date("2026-03-20T05:00:00.000Z"),
  });
  const result = await service.getFinanceSummary({
    from: "2026-03-01",
    to: "2026-03-31",
    granularity: "day",
  });

  assert.deepEqual(result, {
    range: {
      from: "2026-03-01",
      to: "2026-03-31",
      granularity: "day",
    },
    totalOutstandingDebt: 12500000,
    collectedAmountTimeseries: {
      granularity: "day",
      items: [
        { label: "2026-03-05", collectedAmount: 1500000 },
        { label: "2026-03-06", collectedAmount: 750000 },
      ],
      totalCollectedAmount: 2250000,
    },
    newDebtInCurrentMonth: 3200000,
  });
});

test("service getFinanceSummary group collectedAmountTimeseries theo month", async () => {
  const createFinanceReportService = await loadCreateFinanceReportService();
  const db = createDbStub({
    receiptFindManyImpl: async () => [
      {
        NgayThu: new Date("2026-03-05T00:00:00.000Z"),
        SoTienThu: createDecimalLike(1000000),
      },
      {
        NgayThu: new Date("2026-03-31T18:00:00.000Z"),
        SoTienThu: createDecimalLike(500000),
      },
      {
        NgayThu: new Date("2026-04-02T00:00:00.000Z"),
        SoTienThu: createDecimalLike(750000),
      },
    ],
  });

  const service = createFinanceReportService({ db });
  const result = await service.getFinanceSummary({
    from: "2026-03-01",
    to: "2026-04-30",
    granularity: "month",
  });

  assert.deepEqual(result.collectedAmountTimeseries, {
    granularity: "month",
    items: [
      { label: "2026-03", collectedAmount: 1000000 },
      { label: "2026-04", collectedAmount: 1250000 },
    ],
    totalCollectedAmount: 2250000,
  });
});

test("service getFinanceSummary tinh newDebtInCurrentMonth theo boundary thang Viet Nam", async () => {
  const createFinanceReportService = await loadCreateFinanceReportService();
  let receivedAggregateArgs;
  const db = createDbStub({
    repairAggregateImpl: async (args) => {
      receivedAggregateArgs = args;
      return { _sum: { TongTien: createDecimalLike(0) } };
    },
  });

  const service = createFinanceReportService({
    db,
    nowProvider: () => new Date("2026-03-01T00:30:00+07:00"),
  });

  await service.getFinanceSummary({
    from: "2026-02-01",
    to: "2026-03-31",
    granularity: "day",
  });

  assert.equal(
    receivedAggregateArgs.where.NgaySC.gte.toISOString(),
    "2026-02-28T17:00:00.000Z",
  );
  assert.equal(
    receivedAggregateArgs.where.NgaySC.lt.toISOString(),
    "2026-03-31T17:00:00.000Z",
  );
});

test("service getFinanceDebtors groupBy vehicle filter search sort va pagination", async () => {
  const createFinanceReportService = await loadCreateFinanceReportService();
  let receivedCountArgs;
  let receivedFindManyArgs;
  const db = createDbStub({
    vehicleCountImpl: async (args) => {
      receivedCountArgs = args;
      return 3;
    },
    vehicleFindManyImpl: async (args) => {
      receivedFindManyArgs = args;
      return [
        {
          MaXe: 8,
          BienSo: "51A-12345",
          TienNoHienTai: createDecimalLike(5000000),
          KhachHang: {
            MaKH: 10,
            TenChuXe: "Nguyen Van A",
            DienThoai: "0909000001",
          },
        },
        {
          MaXe: 5,
          BienSo: "51A-67890",
          TienNoHienTai: createDecimalLike(3000000),
          KhachHang: {
            MaKH: 11,
            TenChuXe: "Nguyen Van B",
            DienThoai: "0909000002",
          },
        },
      ];
    },
  });

  const service = createFinanceReportService({ db });
  const result = await service.getFinanceDebtors({
    page: 2,
    limit: 2,
    search: "Nguyen",
    groupBy: "vehicle",
  });

  assert.deepEqual(receivedCountArgs.where, receivedFindManyArgs.where);
  assert.deepEqual(receivedFindManyArgs.where, {
    TienNoHienTai: {
      gt: 0,
    },
    OR: [
      {
        BienSo: {
          contains: "Nguyen",
        },
      },
      {
        KhachHang: {
          TenChuXe: {
            contains: "Nguyen",
          },
        },
      },
      {
        KhachHang: {
          DienThoai: {
            contains: "Nguyen",
          },
        },
      },
    ],
  });
  assert.equal(receivedFindManyArgs.skip, 2);
  assert.equal(receivedFindManyArgs.take, 2);
  assert.deepEqual(receivedFindManyArgs.orderBy, [
    { TienNoHienTai: "desc" },
    { MaXe: "asc" },
  ]);
  assert.deepEqual(result, {
    items: [
      {
        vehicleId: 8,
        licensePlate: "51A-12345",
        customerId: 10,
        customerName: "Nguyen Van A",
        phoneNumber: "0909000001",
        outstandingDebt: 5000000,
      },
      {
        vehicleId: 5,
        licensePlate: "51A-67890",
        customerId: 11,
        customerName: "Nguyen Van B",
        phoneNumber: "0909000002",
        outstandingDebt: 3000000,
      },
    ],
    pagination: {
      page: 2,
      limit: 2,
      totalItems: 3,
      totalPages: 2,
    },
  });
});

test("service getFinanceDebtors groupBy customer cong don nhieu xe sort tie-break va paginate sau aggregate", async () => {
  const createFinanceReportService = await loadCreateFinanceReportService();
  let receivedCustomerFindManyArgs;
  const db = createDbStub({
    customerFindManyImpl: async (args) => {
      receivedCustomerFindManyArgs = args;
      return [
        {
          MaKH: 9,
          TenChuXe: "Khach 9",
          DienThoai: "0909",
          Xe: [
            { MaXe: 1, TienNoHienTai: createDecimalLike(1000000) },
            { MaXe: 2, TienNoHienTai: createDecimalLike(2000000) },
          ],
        },
        {
          MaKH: 3,
          TenChuXe: "Khach 3",
          DienThoai: "0903",
          Xe: [{ MaXe: 4, TienNoHienTai: createDecimalLike(3000000) }],
        },
        {
          MaKH: 8,
          TenChuXe: "Khach 8",
          DienThoai: "0908",
          Xe: [
            { MaXe: 6, TienNoHienTai: createDecimalLike(0) },
            { MaXe: 7, TienNoHienTai: createDecimalLike(3000000) },
          ],
        },
      ];
    },
  });

  const service = createFinanceReportService({ db });
  const result = await service.getFinanceDebtors({
    page: 1,
    limit: 2,
    search: "Khach",
    groupBy: "customer",
  });

  assert.deepEqual(receivedCustomerFindManyArgs.where, {
    OR: [
      {
        TenChuXe: {
          contains: "Khach",
        },
      },
      {
        DienThoai: {
          contains: "Khach",
        },
      },
    ],
    Xe: {
      some: {
        TienNoHienTai: {
          gt: 0,
        },
      },
    },
  });

  assert.deepEqual(result, {
    items: [
      {
        customerId: 3,
        customerName: "Khach 3",
        phoneNumber: "0903",
        vehicleCount: 1,
        outstandingDebt: 3000000,
      },
      {
        customerId: 8,
        customerName: "Khach 8",
        phoneNumber: "0908",
        vehicleCount: 1,
        outstandingDebt: 3000000,
      },
    ],
    pagination: {
      page: 1,
      limit: 2,
      totalItems: 3,
      totalPages: 2,
    },
  });
});

test("service getFinanceDebtors groupBy customer tra shape rong on dinh", async () => {
  const createFinanceReportService = await loadCreateFinanceReportService();
  const db = createDbStub();
  const service = createFinanceReportService({ db });

  const result = await service.getFinanceDebtors({
    page: 1,
    limit: 10,
    search: "",
    groupBy: "customer",
  });

  assert.deepEqual(result, {
    items: [],
    pagination: {
      page: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 0,
    },
  });
});
