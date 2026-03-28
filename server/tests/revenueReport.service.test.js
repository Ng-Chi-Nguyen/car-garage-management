import test from "node:test";
import assert from "node:assert/strict";

const ensureTestDatabaseUrl = () => {
  process.env.DATABASE_URL ??= "mysql://tester:secret@127.0.0.1:3306/garage_test";
};

const loadCreateRevenueReportService = async () => {
  ensureTestDatabaseUrl();
  const module = await import("../src/services/report/revenueReport.service.js");
  return module.createRevenueReportService;
};

const createDbStub = ({
  paymentFindManyImpl = async () => [],
  repairDetailFindManyImpl = async () => [],
} = {}) => ({
  pHIEU_THU_TIEN: {
    findMany: paymentFindManyImpl,
  },
  cT_PHIEU_SUA_CHUA: {
    findMany: repairDetailFindManyImpl,
  },
});

test("service getRevenueTimeseries group doanh thu theo day va tinh total", async () => {
  const createRevenueReportService = await loadCreateRevenueReportService();
  const calls = [];
  const db = createDbStub({
    paymentFindManyImpl: async (args) => {
      calls.push(args);
      return [
        { NgayThu: new Date("2026-03-01T00:00:00.000Z"), SoTienThu: 1000000 },
        { NgayThu: new Date("2026-03-01T00:00:00.000Z"), SoTienThu: 500000 },
        { NgayThu: new Date("2026-03-02T00:00:00.000Z"), SoTienThu: 2000000 },
      ];
    },
  });

  const service = createRevenueReportService({ db });

  const result = await service.getRevenueTimeseries({
    granularity: "day",
    from: "2026-03-01",
    to: "2026-03-02",
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].where.TrangThai, "DaThu");
  assert.equal(calls[0].where.NgayThu.gte.toISOString(), "2026-02-28T17:00:00.000Z");
  assert.equal(calls[0].where.NgayThu.lt.toISOString(), "2026-03-02T17:00:00.000Z");
  assert.deepEqual(result, {
    range: {
      from: "2026-03-01",
      to: "2026-03-02",
      granularity: "day",
    },
    items: [
      { label: "2026-03-01", revenue: 1500000 },
      { label: "2026-03-02", revenue: 2000000 },
    ],
    totalRevenue: 3500000,
  });
});

test("service getRevenueByCarBrand group doanh thu theo hieu xe va ratio", async () => {
  const createRevenueReportService = await loadCreateRevenueReportService();
  const db = createDbStub({
    paymentFindManyImpl: async () => [
      {
        SoTienThu: 3000000,
        Xe: { HieuXe: { MaHieuXe: 1, TenHieuXe: "Toyota" } },
      },
      {
        SoTienThu: 1000000,
        Xe: { HieuXe: { MaHieuXe: 2, TenHieuXe: "Honda" } },
      },
      {
        SoTienThu: 2000000,
        Xe: { HieuXe: { MaHieuXe: 1, TenHieuXe: "Toyota" } },
      },
    ],
  });

  const service = createRevenueReportService({ db });
  const result = await service.getRevenueByCarBrand({
    from: "2026-03-01",
    to: "2026-03-31",
  });

  assert.deepEqual(result, {
    range: {
      from: "2026-03-01",
      to: "2026-03-31",
    },
    items: [
      { carBrandId: 1, carBrandName: "Toyota", revenue: 5000000, ratio: 0.8333 },
      { carBrandId: 2, carBrandName: "Honda", revenue: 1000000, ratio: 0.1667 },
    ],
    totalRevenue: 6000000,
  });
});

test("service getRevenueByPart group doanh thu theo phu tung tu chi tiet sua chua", async () => {
  const createRevenueReportService = await loadCreateRevenueReportService();
  const calls = [];
  const db = createDbStub({
    repairDetailFindManyImpl: async (args) => {
      calls.push(args);
      return [
        {
          MaVatTu: 1,
          SoLuong: 2,
          DonGiaVatTu: 500000,
          VatTu: { TenVatTu: "Loc nhot" },
        },
        {
          MaVatTu: 2,
          SoLuong: 1,
          DonGiaVatTu: 800000,
          VatTu: { TenVatTu: "Bugi" },
        },
        {
          MaVatTu: 1,
          SoLuong: 1,
          DonGiaVatTu: 500000,
          VatTu: { TenVatTu: "Loc nhot" },
        },
      ];
    },
  });

  const service = createRevenueReportService({ db });
  const result = await service.getRevenueByPart({
    from: "2026-03-01",
    to: "2026-03-31",
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].where.PhieuSuaChua.NgaySC.gte.toISOString(), "2026-02-28T17:00:00.000Z");
  assert.equal(calls[0].where.PhieuSuaChua.NgaySC.lt.toISOString(), "2026-03-31T17:00:00.000Z");
  assert.deepEqual(result, {
    range: {
      from: "2026-03-01",
      to: "2026-03-31",
    },
    items: [
      { partId: 1, partName: "Loc nhot", revenue: 1500000, ratio: 0.6522 },
      { partId: 2, partName: "Bugi", revenue: 800000, ratio: 0.3478 },
    ],
    totalRevenue: 2300000,
  });
});

test("service getRevenueComparison tinh ky truoc va cung ky nam truoc", async () => {
  const createRevenueReportService = await loadCreateRevenueReportService();
  const calls = [];
  const paymentBatches = [
    [
      { SoTienThu: 4000000 },
      { SoTienThu: 1000000 },
    ],
    [
      { SoTienThu: 2500000 },
      { SoTienThu: 500000 },
    ],
    [
      { SoTienThu: 3000000 },
      { SoTienThu: 500000 },
    ],
  ];
  const db = createDbStub({
    paymentFindManyImpl: async (args) => {
      calls.push(args);
      return paymentBatches.shift();
    },
  });

  const service = createRevenueReportService({ db });
  const result = await service.getRevenueComparison({
    from: "2026-03-10",
    to: "2026-03-12",
  });

  assert.equal(calls.length, 3);
  assert.equal(calls[1].where.NgayThu.gte.toISOString(), "2026-03-06T17:00:00.000Z");
  assert.equal(calls[1].where.NgayThu.lt.toISOString(), "2026-03-09T17:00:00.000Z");
  assert.equal(calls[2].where.NgayThu.gte.toISOString(), "2025-03-09T17:00:00.000Z");
  assert.equal(calls[2].where.NgayThu.lt.toISOString(), "2025-03-12T17:00:00.000Z");
  assert.deepEqual(result, {
    currentPeriod: {
      from: "2026-03-10",
      to: "2026-03-12",
      revenue: 5000000,
    },
    previousPeriod: {
      from: "2026-03-07",
      to: "2026-03-09",
      revenue: 3000000,
    },
    samePeriodLastYear: {
      from: "2025-03-10",
      to: "2025-03-12",
      revenue: 3500000,
    },
    deltaPrevious: 2000000,
    deltaPreviousPercent: 0.6667,
    deltaLastYear: 1500000,
    deltaLastYearPercent: 0.4286,
  });
});

test("service getRevenueComparison clamp same period last year voi ngay 29/02", async () => {
  const createRevenueReportService = await loadCreateRevenueReportService();
  const calls = [];
  const paymentBatches = [
    [{ SoTienThu: 1000000 }],
    [{ SoTienThu: 500000 }],
    [{ SoTienThu: 700000 }],
  ];
  const db = createDbStub({
    paymentFindManyImpl: async (args) => {
      calls.push(args);
      return paymentBatches.shift();
    },
  });

  const service = createRevenueReportService({ db });
  const result = await service.getRevenueComparison({
    from: "2024-02-29",
    to: "2024-02-29",
  });

  assert.equal(calls[2].where.NgayThu.gte.toISOString(), "2023-02-27T17:00:00.000Z");
  assert.equal(calls[2].where.NgayThu.lt.toISOString(), "2023-02-28T17:00:00.000Z");
  assert.deepEqual(result.samePeriodLastYear, {
    from: "2023-02-28",
    to: "2023-02-28",
    revenue: 700000,
  });
});

test("service getRevenueComposition tra ty trong theo nhom hieu xe phu tung khac", async () => {
  const createRevenueReportService = await loadCreateRevenueReportService();
  const db = createDbStub({
    paymentFindManyImpl: async () => [
      {
        SoTienThu: 3000000,
        Xe: { HieuXe: { MaHieuXe: 1, TenHieuXe: "Toyota" } },
      },
      {
        SoTienThu: 1000000,
        Xe: { HieuXe: { MaHieuXe: 2, TenHieuXe: "Honda" } },
      },
    ],
    repairDetailFindManyImpl: async () => [
      {
        MaVatTu: 1,
        SoLuong: 2,
        DonGiaVatTu: 500000,
        DonGiaTienCong: 300000,
        VatTu: { TenVatTu: "Loc nhot" },
      },
      {
        MaVatTu: 2,
        SoLuong: 1,
        DonGiaVatTu: 700000,
        DonGiaTienCong: 200000,
        VatTu: { TenVatTu: "Bugi" },
      },
    ],
  });

  const service = createRevenueReportService({ db });
  const result = await service.getRevenueComposition({
    from: "2026-03-01",
    to: "2026-03-31",
  });

  assert.deepEqual(result, {
    range: {
      from: "2026-03-01",
      to: "2026-03-31",
    },
    groups: [
      {
        key: "carBrand",
        label: "Hiệu xe",
        totalRevenue: 4000000,
        items: [
          { key: 1, label: "Toyota", revenue: 3000000, ratio: 0.75 },
          { key: 2, label: "Honda", revenue: 1000000, ratio: 0.25 },
        ],
      },
      {
        key: "part",
        label: "Phụ tùng",
        totalRevenue: 1700000,
        items: [
          { key: 1, label: "Loc nhot", revenue: 1000000, ratio: 0.5882 },
          { key: 2, label: "Bugi", revenue: 700000, ratio: 0.4118 },
        ],
      },
      {
        key: "other",
        label: "Khác",
        totalRevenue: 500000,
        items: [
          { key: "labor", label: "Tiền công / dịch vụ khác", revenue: 500000, ratio: 1 },
        ],
      },
    ],
  });
});
