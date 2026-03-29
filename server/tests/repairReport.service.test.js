import test from "node:test";
import assert from "node:assert/strict";

const ensureTestDatabaseUrl = () => {
  process.env.DATABASE_URL ??= "mysql://tester:secret@127.0.0.1:3306/garage_test";
};

const loadCreateRepairReportService = async () => {
  ensureTestDatabaseUrl();
  const module = await import("../src/services/report/repairReport.service.js");
  return module.createRepairReportService;
};

const createDbStub = ({ repairOrderFindManyImpl = async () => [] } = {}) => ({
  pHIEU_SUA_CHUA: {
    findMany: repairOrderFindManyImpl,
  },
});

test("service getRepairSummary group timeseries theo day", async () => {
  const createRepairReportService = await loadCreateRepairReportService();
  const db = createDbStub({
    repairOrderFindManyImpl: async () => [
      { NgaySC: new Date("2026-03-01T00:00:00.000Z"), TrangThai: "TiepNhan", MaNV: 1 },
      { NgaySC: new Date("2026-03-01T10:00:00.000Z"), TrangThai: "DangSua", MaNV: 2 },
      { NgaySC: new Date("2026-03-02T00:00:00.000Z"), TrangThai: "HoanTat", MaNV: 1 },
    ],
  });
  const service = createRepairReportService({ db });

  const result = await service.getRepairSummary({
    granularity: "day",
    from: "2026-03-01",
    to: "2026-03-02",
  });

  assert.deepEqual(result.timeseries, {
    items: [
      { label: "2026-03-01", repairOrderCount: 2 },
      { label: "2026-03-02", repairOrderCount: 1 },
    ],
    totalRepairOrders: 3,
  });
});

test("service getRepairSummary group timeseries theo month", async () => {
  const createRepairReportService = await loadCreateRepairReportService();
  const db = createDbStub({
    repairOrderFindManyImpl: async () => [
      { NgaySC: new Date("2026-01-03T00:00:00.000Z"), TrangThai: "TiepNhan", MaNV: 1 },
      { NgaySC: new Date("2026-01-05T00:00:00.000Z"), TrangThai: "DangSua", MaNV: 2 },
      { NgaySC: new Date("2026-02-01T00:00:00.000Z"), TrangThai: "HoanTat", MaNV: 3 },
    ],
  });
  const service = createRepairReportService({ db });

  const result = await service.getRepairSummary({
    granularity: "month",
    from: "2026-01-01",
    to: "2026-02-28",
  });

  assert.deepEqual(result.timeseries, {
    items: [
      { label: "2026-01", repairOrderCount: 2 },
      { label: "2026-02", repairOrderCount: 1 },
    ],
    totalRepairOrders: 3,
  });
});

test("service getRepairSummary map statusBreakdown dung 4 trang thai", async () => {
  const createRepairReportService = await loadCreateRepairReportService();
  const db = createDbStub({
    repairOrderFindManyImpl: async () => [
      { NgaySC: new Date("2026-03-01T00:00:00.000Z"), TrangThai: "TiepNhan", MaNV: 1 },
      { NgaySC: new Date("2026-03-01T01:00:00.000Z"), TrangThai: "TiepNhan", MaNV: 2 },
      { NgaySC: new Date("2026-03-01T02:00:00.000Z"), TrangThai: "DangSua", MaNV: 2 },
      { NgaySC: new Date("2026-03-01T03:00:00.000Z"), TrangThai: "HoanTat", MaNV: 3 },
      { NgaySC: new Date("2026-03-01T04:00:00.000Z"), TrangThai: "HoanTat", MaNV: 3 },
      { NgaySC: new Date("2026-03-01T05:00:00.000Z"), TrangThai: "HoanTat", MaNV: 4 },
      { NgaySC: new Date("2026-03-01T06:00:00.000Z"), TrangThai: "Huy", MaNV: 4 },
    ],
  });
  const service = createRepairReportService({ db });

  const result = await service.getRepairSummary({
    granularity: "day",
    from: "2026-03-01",
    to: "2026-03-01",
  });

  assert.deepEqual(result.statusBreakdown, {
    receiving: 2,
    inProgress: 1,
    completed: 3,
    cancelled: 1,
    total: 7,
  });
});

test("service getRepairSummary fail-fast khi gap TrangThai la", async () => {
  const createRepairReportService = await loadCreateRepairReportService();
  const db = createDbStub({
    repairOrderFindManyImpl: async () => [
      { NgaySC: new Date("2026-03-01T00:00:00.000Z"), TrangThai: "KhongHopLe", MaNV: 1 },
    ],
  });
  const service = createRepairReportService({ db });

  await assert.rejects(
    () =>
      service.getRepairSummary({
        granularity: "day",
        from: "2026-03-01",
        to: "2026-03-01",
      }),
    /TrangThai.*KhongHopLe/,
  );
});

test("service getRepairSummary chi tra contract summary moi", async () => {
  const createRepairReportService = await loadCreateRepairReportService();
  const db = createDbStub({
    repairOrderFindManyImpl: async () => [
      {
        NgaySC: new Date("2026-03-01T00:00:00.000Z"),
        NgayKetThuc: new Date("2026-03-01T12:00:00.000Z"),
        TrangThai: "HoanTat",
        MaNV: 1,
      },
      {
        NgaySC: new Date("2026-03-02T00:00:00.000Z"),
        NgayKetThuc: new Date("2026-03-03T00:00:00.000Z"),
        TrangThai: "Huy",
        MaNV: 2,
      },
      {
        NgaySC: new Date("2026-03-03T00:00:00.000Z"),
        NgayKetThuc: new Date("2026-03-04T00:00:00.000Z"),
        TrangThai: "DangSua",
        MaNV: 3,
      },
      {
        NgaySC: new Date("2026-03-04T00:00:00.000Z"),
        NgayKetThuc: null,
        TrangThai: "HoanTat",
        MaNV: 4,
      },
    ],
  });
  const service = createRepairReportService({ db });

  const result = await service.getRepairSummary({
    granularity: "day",
    from: "2026-03-01",
    to: "2026-03-31",
  });

  assert.deepEqual(Object.keys(result).sort(), [
    "range",
    "statusBreakdown",
    "timeseries",
    "topTechnician",
  ]);
  assert.equal("averageRepairDuration" in result, false);
});

test("service getRepairSummary topTechnician bo qua MaNV null va tie-break tang dan", async () => {
  const createRepairReportService = await loadCreateRepairReportService();
  const db = createDbStub({
    repairOrderFindManyImpl: async () => [
      { NgaySC: new Date("2026-03-01T00:00:00.000Z"), TrangThai: "DangSua", MaNV: null },
      { NgaySC: new Date("2026-03-01T01:00:00.000Z"), TrangThai: "DangSua", MaNV: 2 },
      { NgaySC: new Date("2026-03-01T02:00:00.000Z"), TrangThai: "DangSua", MaNV: 2 },
      { NgaySC: new Date("2026-03-01T03:00:00.000Z"), TrangThai: "DangSua", MaNV: 1 },
      { NgaySC: new Date("2026-03-01T04:00:00.000Z"), TrangThai: "DangSua", MaNV: 1 },
      { NgaySC: new Date("2026-03-01T05:00:00.000Z"), TrangThai: "DangSua", MaNV: 3 },
    ],
  });
  const service = createRepairReportService({ db });

  const result = await service.getRepairSummary({
    granularity: "day",
    from: "2026-03-01",
    to: "2026-03-31",
  });

  assert.deepEqual(result.topTechnician, {
    technicianId: 1,
    repairOrderCount: 2,
  });
});

test("service getRepairSummary topTechnician la null khi khong co ky thuat vien hop le", async () => {
  const createRepairReportService = await loadCreateRepairReportService();
  const db = createDbStub({
    repairOrderFindManyImpl: async () => [
      { NgaySC: new Date("2026-03-01T00:00:00.000Z"), TrangThai: "TiepNhan", MaNV: null },
      { NgaySC: new Date("2026-03-01T01:00:00.000Z"), TrangThai: "DangSua", MaNV: null },
    ],
  });
  const service = createRepairReportService({ db });

  const result = await service.getRepairSummary({
    granularity: "day",
    from: "2026-03-01",
    to: "2026-03-31",
  });

  assert.equal(result.topTechnician, null);
});

test("service getRepairSummary dung range gte lt theo ngay Viet Nam", async () => {
  const createRepairReportService = await loadCreateRepairReportService();
  const calls = [];
  const db = createDbStub({
    repairOrderFindManyImpl: async (args) => {
      calls.push(args);
      return [];
    },
  });
  const service = createRepairReportService({ db });

  await service.getRepairSummary({
    granularity: "year",
    from: "2026-03-01",
    to: "2026-03-31",
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].where.NgaySC.gte.toISOString(), "2026-02-28T17:00:00.000Z");
  assert.equal(calls[0].where.NgaySC.lt.toISOString(), "2026-03-31T17:00:00.000Z");
});
