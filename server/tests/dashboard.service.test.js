import test from "node:test";
import assert from "node:assert/strict";

const ensureTestDatabaseUrl = () => {
  process.env.DATABASE_URL ??= "mysql://tester:secret@127.0.0.1:3306/garage_test";
};

const loadCreateDashboardService = async () => {
  ensureTestDatabaseUrl();
  const module = await import("../src/services/report/dashboard.service.js");
  return module.createDashboardService;
};

const createDbStub = ({
  aggregateImpl,
  countImpl = async () => 0,
  vehicleAggregateImpl = async () => ({ _sum: { TienNoHienTai: 0 } }),
  partCountImpl = async () => 0,
} = {}) => ({
  pHIEU_THU_TIEN: {
    aggregate: aggregateImpl,
  },
  pHIEU_SUA_CHUA: {
    count: countImpl,
  },
  xE: {
    aggregate: vehicleAggregateImpl,
  },
  vAT_TU: {
    count: partCountImpl,
  },
});

test("service goi aggregate voi dung khoang ngay cho today week month", async () => {
  const createDashboardService = await loadCreateDashboardService();
  const calls = [];
  const db = createDbStub({
    aggregateImpl: async (args) => {
      calls.push(args);
      return { _sum: { SoTienThu: 0 } };
    },
  });

  const service = createDashboardService({
    db,
    nowProvider: () => new Date("2026-03-28T10:15:00+07:00"),
  });

  await service.getRevenueSummary();

  assert.equal(calls.length, 4);
  assert.equal(calls[0].where.TrangThai, "DaThu");
  assert.equal(calls[0].where.NgayThu.gte.toISOString(), "2026-03-27T17:00:00.000Z");
  assert.equal(calls[0].where.NgayThu.lt.toISOString(), "2026-03-28T17:00:00.000Z");
  assert.equal(calls[1].where.NgayThu.gte.toISOString(), "2026-03-22T17:00:00.000Z");
  assert.equal(calls[1].where.NgayThu.lt.toISOString(), "2026-03-28T17:00:00.000Z");
  assert.equal(calls[2].where.NgayThu.gte.toISOString(), "2026-02-28T17:00:00.000Z");
  assert.equal(calls[2].where.NgayThu.lt.toISOString(), "2026-03-28T17:00:00.000Z");
  assert.equal("NgayThu" in calls[3].where, false);
});

test("service tinh startOfCurrentWeekMonday dung khi now roi vao thu 2", async () => {
  const createDashboardService = await loadCreateDashboardService();
  const calls = [];
  const db = createDbStub({
    aggregateImpl: async (args) => {
      calls.push(args);
      return { _sum: { SoTienThu: 0 } };
    },
  });

  const service = createDashboardService({
    db,
    nowProvider: () => new Date("2026-03-30T09:00:00+07:00"),
  });

  await service.getRevenueSummary();

  assert.equal(calls[1].where.NgayThu.gte.toISOString(), "2026-03-29T17:00:00.000Z");
  assert.equal(calls[1].where.NgayThu.lt.toISOString(), "2026-03-30T17:00:00.000Z");
});

test("service tra 0 khi aggregate tra null", async () => {
  const createDashboardService = await loadCreateDashboardService();
  const db = createDbStub({
    aggregateImpl: async () => ({ _sum: { SoTienThu: null } }),
  });

  const service = createDashboardService({
    db,
    nowProvider: () => new Date("2026-03-28T10:15:00+07:00"),
  });

  const result = await service.getRevenueSummary();

  assert.equal(result.summary.todayRevenue, 0);
  assert.equal(result.summary.weekRevenue, 0);
  assert.equal(result.summary.monthRevenue, 0);
});

test("service convert ket qua aggregate sang number", async () => {
  const createDashboardService = await loadCreateDashboardService();
  const db = createDbStub({
    aggregateImpl: async () => ({
      _sum: {
        SoTienThu: {
          toString: () => "1250000.50",
        },
      },
    }),
  });

  const service = createDashboardService({
    db,
    nowProvider: () => new Date("2026-03-28T10:15:00+07:00"),
  });

  const result = await service.getRevenueSummary();

  assert.equal(result.summary.todayRevenue, 1250000.5);
  assert.equal(result.summary.weekRevenue, 1250000.5);
  assert.equal(result.summary.monthRevenue, 1250000.5);
  assert.equal(Number.isFinite(result.summary.todayRevenue), true);
  assert.equal(Number.isFinite(result.summary.weekRevenue), true);
  assert.equal(Number.isFinite(result.summary.monthRevenue), true);
});

test("service throw loi ro rang khi aggregate tra gia tri khong hop le", async () => {
  const createDashboardService = await loadCreateDashboardService();
  const db = createDbStub({
    aggregateImpl: async () => ({
      _sum: {
        SoTienThu: {
          toString: () => "abc",
        },
      },
    }),
  });

  const service = createDashboardService({
    db,
    nowProvider: () => new Date("2026-03-28T10:15:00+07:00"),
  });

  await assert.rejects(
    service.getRevenueSummary(),
    /Invalid aggregate revenue value: abc/,
  );
});

test("service tinh dung bien ngay khi qua thang moi va nam moi", async () => {
  const createDashboardService = await loadCreateDashboardService();
  const calls = [];
  const db = createDbStub({
    aggregateImpl: async (args) => {
      calls.push(args);
      return { _sum: { SoTienThu: 0 } };
    },
  });

  const service = createDashboardService({
    db,
    nowProvider: () => new Date("2026-01-01T10:00:00+07:00"),
  });

  await service.getRevenueSummary();

  assert.equal(calls[0].where.NgayThu.gte.toISOString(), "2025-12-31T17:00:00.000Z");
  assert.equal(calls[0].where.NgayThu.lt.toISOString(), "2026-01-01T17:00:00.000Z");
  assert.equal(calls[1].where.NgayThu.gte.toISOString(), "2025-12-28T17:00:00.000Z");
  assert.equal(calls[1].where.NgayThu.lt.toISOString(), "2026-01-01T17:00:00.000Z");
  assert.equal(calls[2].where.NgayThu.gte.toISOString(), "2025-12-31T17:00:00.000Z");
  assert.equal(calls[2].where.NgayThu.lt.toISOString(), "2026-01-01T17:00:00.000Z");
});

test("service tinh dung week boundary khi now roi vao chu nhat", async () => {
  const createDashboardService = await loadCreateDashboardService();
  const calls = [];
  const db = createDbStub({
    aggregateImpl: async (args) => {
      calls.push(args);
      return { _sum: { SoTienThu: 0 } };
    },
  });

  const service = createDashboardService({
    db,
    nowProvider: () => new Date("2026-03-29T09:00:00+07:00"),
  });

  await service.getRevenueSummary();

  assert.equal(calls[0].where.NgayThu.gte.toISOString(), "2026-03-28T17:00:00.000Z");
  assert.equal(calls[0].where.NgayThu.lt.toISOString(), "2026-03-29T17:00:00.000Z");
  assert.equal(calls[1].where.NgayThu.gte.toISOString(), "2026-03-22T17:00:00.000Z");
  assert.equal(calls[1].where.NgayThu.lt.toISOString(), "2026-03-29T17:00:00.000Z");
  assert.equal(calls[2].where.NgayThu.gte.toISOString(), "2026-02-28T17:00:00.000Z");
  assert.equal(calls[2].where.NgayThu.lt.toISOString(), "2026-03-29T17:00:00.000Z");
});

test("service dem so xe da tiep nhan hom nay theo NgaySC va them vao summary", async () => {
  const createDashboardService = await loadCreateDashboardService();
  const aggregateCalls = [];
  const countCalls = [];
  const db = createDbStub({
    aggregateImpl: async (args) => {
      aggregateCalls.push(args);
      return { _sum: { SoTienThu: 0 } };
    },
    countImpl: async (args) => {
      countCalls.push(args);
      return 4;
    },
  });

  const service = createDashboardService({
    db,
    nowProvider: () => new Date("2026-03-28T10:15:00+07:00"),
  });

  const result = await service.getRevenueSummary();

  assert.equal(aggregateCalls.length, 4);
  assert.equal(countCalls.length, 2);
  assert.equal(countCalls[0].where.NgaySC.gte.toISOString(), "2026-03-27T17:00:00.000Z");
  assert.equal(countCalls[0].where.NgaySC.lt.toISOString(), "2026-03-28T17:00:00.000Z");
  assert.equal("TrangThai" in countCalls[0].where, false);
  assert.deepEqual(countCalls[1].where.TrangThai.in, ["TiepNhan", "DangSua"]);
  assert.equal(result.summary.todayReceivedVehicles, 4);
});

test("service tinh todayReceivedVehicles dung tai boundary doi ngay theo gio Viet Nam", async () => {
  const createDashboardService = await loadCreateDashboardService();
  const countCalls = [];
  const db = createDbStub({
    aggregateImpl: async () => ({ _sum: { SoTienThu: 0 } }),
    countImpl: async (args) => {
      countCalls.push(args);
      return 0;
    },
  });

  const service = createDashboardService({
    db,
    nowProvider: () => new Date("2026-03-28T00:05:00+07:00"),
  });

  await service.getRevenueSummary();

  assert.equal(countCalls[0].where.NgaySC.gte.toISOString(), "2026-03-27T17:00:00.000Z");
  assert.equal(countCalls[0].where.NgaySC.lt.toISOString(), "2026-03-28T17:00:00.000Z");
});

test("service tra them metric dashboard mo rong va canh bao nhanh", async () => {
  const createDashboardService = await loadCreateDashboardService();
  const paymentAggregateCalls = [];
  const repairOrderCountCalls = [];
  const vehicleAggregateCalls = [];
  const partCountCalls = [];
  const paymentAggregateResults = [
    { _sum: { SoTienThu: 1000000 } },
    { _sum: { SoTienThu: 5000000 } },
    { _sum: { SoTienThu: 12000000 } },
    { _sum: { SoTienThu: 80000000 } },
  ];
  const repairOrderCountResults = [30, 18];

  const db = createDbStub({
    aggregateImpl: async (args) => {
      paymentAggregateCalls.push(args);
      return paymentAggregateResults.shift();
    },
    countImpl: async (args) => {
      repairOrderCountCalls.push(args);
      return repairOrderCountResults.shift();
    },
    vehicleAggregateImpl: async (args) => {
      vehicleAggregateCalls.push(args);
      return { _sum: { TienNoHienTai: 120000000 } };
    },
    partCountImpl: async (args) => {
      partCountCalls.push(args);
      return 12;
    },
  });

  const service = createDashboardService({
    db,
    nowProvider: () => new Date("2026-03-28T10:15:00+07:00"),
  });

  const result = await service.getRevenueSummary();

  assert.equal(result.summary.todayRevenue, 1000000);
  assert.equal(result.summary.weekRevenue, 5000000);
  assert.equal(result.summary.monthRevenue, 12000000);
  assert.equal(result.summary.todayReceivedVehicles, 30);
  assert.equal(result.summary.activeRepairOrders, 18);
  assert.equal(result.summary.totalCollectedAmount, 80000000);
  assert.equal(result.summary.totalOutstandingDebt, 120000000);
  assert.equal(result.summary.lowStockPartsCount, 12);

  assert.equal(repairOrderCountCalls.length, 2);
  assert.deepEqual(repairOrderCountCalls[1].where.TrangThai.in, ["TiepNhan", "DangSua"]);
  assert.equal(partCountCalls[0].where.SoLuongTon.lte, 5);
  assert.equal(vehicleAggregateCalls[0].where.TienNoHienTai.gt, 0);

  assert.deepEqual(result.alerts, [
    {
      code: "OVER_CAPACITY",
      severity: "warning",
      title: "Vượt số xe tiếp nhận tối đa",
      message: "Hiện tại 30/30 xe. Vui lòng kiểm tra lại công suất tiếp nhận.",
    },
    {
      code: "HIGH_DEBT",
      severity: "warning",
      title: "Công nợ cao",
      message: "Công nợ hiện tại 120.000.000đ, cần theo dõi và thu hồi sớm.",
    },
    {
      code: "LOW_STOCK",
      severity: "warning",
      title: "Vật tư tồn kho thấp",
      message: "Có 12 vật tư/phụ tùng ở mức tồn kho thấp.",
    },
  ]);
});

test("service khong tao canh bao nhanh khi cac chi so van trong nguong", async () => {
  const createDashboardService = await loadCreateDashboardService();
  const paymentAggregateResults = [
    { _sum: { SoTienThu: 0 } },
    { _sum: { SoTienThu: 0 } },
    { _sum: { SoTienThu: 0 } },
    { _sum: { SoTienThu: 15000000 } },
  ];
  const repairOrderCountResults = [12, 4];
  const db = createDbStub({
    aggregateImpl: async () => paymentAggregateResults.shift(),
    countImpl: async () => repairOrderCountResults.shift(),
    vehicleAggregateImpl: async () => ({ _sum: { TienNoHienTai: 25000000 } }),
    partCountImpl: async () => 0,
  });

  const service = createDashboardService({
    db,
    nowProvider: () => new Date("2026-03-28T10:15:00+07:00"),
  });

  const result = await service.getRevenueSummary();

  assert.deepEqual(result.alerts, []);
  assert.equal(result.summary.totalCollectedAmount, 15000000);
  assert.equal(result.summary.totalOutstandingDebt, 25000000);
  assert.equal(result.summary.activeRepairOrders, 4);
  assert.equal(result.summary.lowStockPartsCount, 0);
});
