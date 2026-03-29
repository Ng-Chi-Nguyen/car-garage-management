import test from "node:test";
import assert from "node:assert/strict";

const ensureTestDatabaseUrl = () => {
  process.env.DATABASE_URL ??= "mysql://tester:secret@127.0.0.1:3306/garage_test";
};

const loadCreateCustomerReportService = async () => {
  ensureTestDatabaseUrl();
  const module = await import("../src/services/report/customerReport.service.js");
  return module.createCustomerReportService;
};

const createDbStub = ({
  customerFindManyImpl = async () => [],
  receiptFindManyImpl = async () => [],
  carFindManyImpl = async () => [],
} = {}) => ({
  kHACH_HANG: {
    findMany: customerFindManyImpl,
  },
  pHIEU_THU_TIEN: {
    findMany: receiptFindManyImpl,
  },
  xE: {
    findMany: carFindManyImpl,
  },
});

const createDecimalLike = (value) => ({
  toString: () => String(value),
});

test("service getCustomerSummary group khach hang moi theo month", async () => {
  const createCustomerReportService = await loadCreateCustomerReportService();
  const db = createDbStub({
    customerFindManyImpl: async () => [
      { NgayTao: new Date("2026-03-05T00:00:00.000Z") },
      { NgayTao: new Date("2026-03-20T12:00:00.000Z") },
      { NgayTao: new Date("2026-04-02T00:00:00.000Z") },
    ],
  });

  const service = createCustomerReportService({ db });
  const result = await service.getCustomerSummary({
    from: "2026-03-01",
    to: "2026-04-30",
    granularity: "month",
  });

  assert.deepEqual(result.newCustomersTimeseries, {
    items: [
      { label: "2026-03", newCustomers: 2 },
      { label: "2026-04", newCustomers: 1 },
    ],
    totalNewCustomers: 3,
  });
});

test("service getCustomerSummary topRevenueCustomer cong don nhieu xe cung khach", async () => {
  const createCustomerReportService = await loadCreateCustomerReportService();
  const db = createDbStub({
    receiptFindManyImpl: async () => [
      {
        SoTienThu: 1000000,
        Xe: { KhachHang: { MaKH: 1, TenChuXe: "Nguyen Van A" } },
      },
      {
        SoTienThu: 500000,
        Xe: { KhachHang: { MaKH: 1, TenChuXe: "Nguyen Van A" } },
      },
      {
        SoTienThu: 1200000,
        Xe: { KhachHang: { MaKH: 2, TenChuXe: "Tran Thi B" } },
      },
    ],
  });

  const service = createCustomerReportService({ db });
  const result = await service.getCustomerSummary({
    from: "2026-03-01",
    to: "2026-03-31",
    granularity: "day",
  });

  assert.deepEqual(result.topRevenueCustomer, {
    customerId: 1,
    customerName: "Nguyen Van A",
    totalRevenue: 1500000,
  });
});

test("service getCustomerSummary topDebtCustomer cong don TienNoHienTai nhieu xe", async () => {
  const createCustomerReportService = await loadCreateCustomerReportService();
  const db = createDbStub({
    carFindManyImpl: async () => [
      {
        TienNoHienTai: 300000,
        KhachHang: { MaKH: 1, TenChuXe: "Nguyen Van A" },
      },
      {
        TienNoHienTai: 250000,
        KhachHang: { MaKH: 1, TenChuXe: "Nguyen Van A" },
      },
      {
        TienNoHienTai: 500000,
        KhachHang: { MaKH: 2, TenChuXe: "Tran Thi B" },
      },
    ],
  });

  const service = createCustomerReportService({ db });
  const result = await service.getCustomerSummary({
    from: "2026-03-01",
    to: "2026-03-31",
    granularity: "day",
  });

  assert.deepEqual(result.topDebtCustomer, {
    customerId: 1,
    customerName: "Nguyen Van A",
    totalDebt: 550000,
  });
});

test("service getCustomerSummary tie-break deterministic theo customerId", async () => {
  const createCustomerReportService = await loadCreateCustomerReportService();
  const db = createDbStub({
    receiptFindManyImpl: async () => [
      {
        SoTienThu: 1000000,
        Xe: { KhachHang: { MaKH: 2, TenChuXe: "Khach 2" } },
      },
      {
        SoTienThu: 1000000,
        Xe: { KhachHang: { MaKH: 1, TenChuXe: "Khach 1" } },
      },
    ],
    carFindManyImpl: async () => [
      {
        TienNoHienTai: 500000,
        KhachHang: { MaKH: 4, TenChuXe: "Khach 4" },
      },
      {
        TienNoHienTai: 500000,
        KhachHang: { MaKH: 3, TenChuXe: "Khach 3" },
      },
    ],
  });

  const service = createCustomerReportService({ db });
  const result = await service.getCustomerSummary({
    from: "2026-03-01",
    to: "2026-03-31",
    granularity: "day",
  });

  assert.deepEqual(result.topRevenueCustomer, {
    customerId: 1,
    customerName: "Khach 1",
    totalRevenue: 1000000,
  });
  assert.deepEqual(result.topDebtCustomer, {
    customerId: 3,
    customerName: "Khach 3",
    totalDebt: 500000,
  });
});

test("service getCustomerSummary topRevenueCustomer la null khi khong co phieu hop le", async () => {
  const createCustomerReportService = await loadCreateCustomerReportService();
  const db = createDbStub({
    receiptFindManyImpl: async () => [
      { SoTienThu: 500000, Xe: null },
      { SoTienThu: 700000, Xe: { KhachHang: null } },
      { SoTienThu: null, Xe: { KhachHang: { MaKH: 1, TenChuXe: "Khach 1" } } },
    ],
  });

  const service = createCustomerReportService({ db });
  const result = await service.getCustomerSummary({
    from: "2026-03-01",
    to: "2026-03-31",
    granularity: "day",
  });

  assert.equal(result.topRevenueCustomer, null);
});

test("service getCustomerSummary topDebtCustomer la null khi khong co no hop le", async () => {
  const createCustomerReportService = await loadCreateCustomerReportService();
  const db = createDbStub({
    carFindManyImpl: async () => [
      {
        TienNoHienTai: 0,
        KhachHang: { MaKH: 1, TenChuXe: "Khach 1" },
      },
      {
        TienNoHienTai: -1000,
        KhachHang: { MaKH: 2, TenChuXe: "Khach 2" },
      },
      {
        TienNoHienTai: 900000,
        KhachHang: null,
      },
    ],
  });

  const service = createCustomerReportService({ db });
  const result = await service.getCustomerSummary({
    from: "2026-03-01",
    to: "2026-03-31",
    granularity: "day",
  });

  assert.equal(result.topDebtCustomer, null);
});

test("service getCustomerSummary newCustomersTimeseries rong khi khong co khach moi", async () => {
  const createCustomerReportService = await loadCreateCustomerReportService();
  const db = createDbStub();

  const service = createCustomerReportService({ db });
  const result = await service.getCustomerSummary({
    from: "2026-03-01",
    to: "2026-03-31",
    granularity: "month",
  });

  assert.deepEqual(result.newCustomersTimeseries, {
    items: [],
    totalNewCustomers: 0,
  });
});

test("service getCustomerSummary skip record khach hang moi khong hop le de khong lam sap report", async () => {
  const createCustomerReportService = await loadCreateCustomerReportService();
  const db = createDbStub({
    customerFindManyImpl: async () => [
      null,
      {},
      { NgayTao: null },
      { NgayTao: undefined },
      { NgayTao: new Date("2026-03-20T00:00:00.000Z") },
    ],
  });

  const service = createCustomerReportService({ db });
  const result = await service.getCustomerSummary({
    from: "2026-03-01",
    to: "2026-03-31",
    granularity: "month",
  });

  assert.deepEqual(result.newCustomersTimeseries, {
    items: [{ label: "2026-03", newCustomers: 1 }],
    totalNewCustomers: 1,
  });
});

test("service getCustomerSummary chap nhan gia tri Decimal-like qua toString cho SoTienThu TienNoHienTai va MaKH", async () => {
  const createCustomerReportService = await loadCreateCustomerReportService();
  const db = createDbStub({
    receiptFindManyImpl: async () => [
      {
        SoTienThu: createDecimalLike("1000000.50"),
        Xe: {
          KhachHang: {
            MaKH: createDecimalLike("10"),
            TenChuXe: "Khach Decimal",
          },
        },
      },
      {
        SoTienThu: 500000,
        Xe: {
          KhachHang: {
            MaKH: createDecimalLike("11"),
            TenChuXe: "Khach 11",
          },
        },
      },
    ],
    carFindManyImpl: async () => [
      {
        TienNoHienTai: createDecimalLike("250000.25"),
        KhachHang: {
          MaKH: createDecimalLike("10"),
          TenChuXe: "Khach Decimal",
        },
      },
      {
        TienNoHienTai: 100000,
        KhachHang: {
          MaKH: createDecimalLike("11"),
          TenChuXe: "Khach 11",
        },
      },
    ],
  });

  const service = createCustomerReportService({ db });
  const result = await service.getCustomerSummary({
    from: "2026-03-01",
    to: "2026-03-31",
    granularity: "day",
  });

  assert.deepEqual(result.topRevenueCustomer, {
    customerId: 10,
    customerName: "Khach Decimal",
    totalRevenue: 1000000.5,
  });
  assert.deepEqual(result.topDebtCustomer, {
    customerId: 10,
    customerName: "Khach Decimal",
    totalDebt: 250000.25,
  });
});

test("service getCustomerSummary bo qua MaKH khong nguyen thay vi trunc", async () => {
  const createCustomerReportService = await loadCreateCustomerReportService();
  const db = createDbStub({
    receiptFindManyImpl: async () => [
      {
        SoTienThu: 2000000,
        Xe: {
          KhachHang: {
            MaKH: createDecimalLike("1.9"),
            TenChuXe: "Khach Khong Hop Le",
          },
        },
      },
      {
        SoTienThu: 1000000,
        Xe: {
          KhachHang: {
            MaKH: 2,
            TenChuXe: "Khach 2",
          },
        },
      },
    ],
    carFindManyImpl: async () => [
      {
        TienNoHienTai: 900000,
        KhachHang: {
          MaKH: 3.5,
          TenChuXe: "Khach No Khong Hop Le",
        },
      },
      {
        TienNoHienTai: 400000,
        KhachHang: {
          MaKH: 4,
          TenChuXe: "Khach 4",
        },
      },
    ],
  });

  const service = createCustomerReportService({ db });
  const result = await service.getCustomerSummary({
    from: "2026-03-01",
    to: "2026-03-31",
    granularity: "day",
  });

  assert.deepEqual(result.topRevenueCustomer, {
    customerId: 2,
    customerName: "Khach 2",
    totalRevenue: 1000000,
  });
  assert.deepEqual(result.topDebtCustomer, {
    customerId: 4,
    customerName: "Khach 4",
    totalDebt: 400000,
  });
});

test("service getCustomerSummary dung range gte/lt theo ngay Viet Nam cho NgayTao va NgayThu", async () => {
  const createCustomerReportService = await loadCreateCustomerReportService();
  const customerCalls = [];
  const receiptCalls = [];
  const db = createDbStub({
    customerFindManyImpl: async (args) => {
      customerCalls.push(args);
      return [
        { NgayTao: new Date("2026-02-28T17:00:00.000Z") },
        { NgayTao: new Date("2026-03-01T16:59:59.000Z") },
      ];
    },
    receiptFindManyImpl: async (args) => {
      receiptCalls.push(args);
      return [
        {
          NgayThu: new Date("2026-02-28T17:00:00.000Z"),
          SoTienThu: 100000,
          Xe: { KhachHang: { MaKH: 1, TenChuXe: "Khach 1" } },
        },
        {
          NgayThu: new Date("2026-03-01T16:59:59.000Z"),
          SoTienThu: 200000,
          Xe: { KhachHang: { MaKH: 1, TenChuXe: "Khach 1" } },
        },
      ];
    },
  });

  const service = createCustomerReportService({ db });
  const result = await service.getCustomerSummary({
    from: "2026-03-01",
    to: "2026-03-01",
    granularity: "day",
  });

  assert.equal(customerCalls.length, 1);
  assert.equal(
    customerCalls[0].where.NgayTao.gte.toISOString(),
    "2026-02-28T17:00:00.000Z",
  );
  assert.equal(
    customerCalls[0].where.NgayTao.lt.toISOString(),
    "2026-03-01T17:00:00.000Z",
  );

  assert.equal(receiptCalls.length, 1);
  assert.equal(
    receiptCalls[0].where.NgayThu.gte.toISOString(),
    "2026-02-28T17:00:00.000Z",
  );
  assert.equal(
    receiptCalls[0].where.NgayThu.lt.toISOString(),
    "2026-03-01T17:00:00.000Z",
  );
  assert.deepEqual(result.newCustomersTimeseries.items, [
    { label: "2026-03-01", newCustomers: 2 },
  ]);
});
