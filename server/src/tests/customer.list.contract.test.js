import test from "node:test";
import assert from "node:assert/strict";

process.env.DATABASE_URL ??= "mysql://user:pass@localhost:3306/garage";

const [{ default: customerSchema }, { createCustomerService }] = await Promise.all([
  import("../validator/management/customer.validator.js"),
  import("../services/management/customer.service.js"),
]);

const buildService = ({ customers = [], vehicles = [], count = customers.length } = {}) => {
  const calls = {
    count: [],
    findMany: [],
    vehicleFindMany: [],
  };

  const service = createCustomerService({
    customerDelegate: {
      count: async (args) => {
        calls.count.push(args);
        return count;
      },
      findMany: async (args) => {
        calls.findMany.push(args);
        return customers;
      },
      findUnique: async () => null,
      create: async () => null,
      update: async () => null,
      delete: async () => null,
    },
    vehicleDelegate: {
      count: async () => 0,
      findMany: async (args) => {
        calls.vehicleFindMany.push(args);
        return vehicles;
      },
    },
    uploadPublicImage: async () => null,
    removeObject: async () => null,
    processAvatarImage: async () => ({ buffer: Buffer.from(""), contentType: "image/webp" }),
  });

  return { service, calls };
};

test("customer list query accepts advanced filters", () => {
  const result = customerSchema.getAll.query.validate({
    page: 1,
    limit: 10,
    search: "Nguyễn",
    TenChuXe: "Nguyễn Văn A",
    DienThoai: "0909009009",
    Email: "a@example.com",
    DiaChi: "Hà Nội",
    ChucVu: "KhachHang",
    TrangThai: ["HoatDong"],
    NgayTaoFrom: "2025-01-01",
    NgayTaoTo: "2025-12-31",
    NgayCapNhatFrom: "2025-01-01",
    NgayCapNhatTo: "2025-12-31",
    BienSo: "51A-123.45",
    CongNoFrom: 100000,
    CongNoTo: 250000,
  });

  assert.equal(result.error, undefined);
  assert.equal(result.value.BienSo, "51A-123.45");
  assert.equal(result.value.CongNoFrom, 100000);
  assert.equal(result.value.CongNoTo, 250000);
});

test("customer list returns backend summary fields", async () => {
  const { service } = buildService({
    customers: [
      {
        MaKH: 1,
        TenChuXe: "Nguyễn Văn A",
        DienThoai: "0909009009",
        Email: "a@example.com",
        DiaChi: "Hà Nội",
        ChucVu: "KhachHang",
        TrangThai: "HoatDong",
        NgayTao: new Date("2025-01-01T00:00:00.000Z"),
        NgayCapNhat: new Date("2025-03-01T00:00:00.000Z"),
        Xe: [
          {
            MaXe: 11,
            BienSo: "51A-123.45",
            TienNoHienTai: "100000.00",
            PhieuSuaChua: [
              {
                MaPhieuSC: 101,
                TongTien: "200000.00",
                NgaySC: new Date("2025-02-01T00:00:00.000Z"),
                NgayTao: new Date("2025-02-01T00:00:00.000Z"),
              },
            ],
          },
          {
            MaXe: 12,
            BienSo: "51B-999.99",
            TienNoHienTai: "250000.00",
            PhieuSuaChua: [
              {
                MaPhieuSC: 102,
                TongTien: "300000.00",
                NgaySC: null,
                NgayTao: new Date("2025-04-10T00:00:00.000Z"),
              },
            ],
          },
        ],
      },
    ],
  });

  const result = await service.getCustomerList({ page: 1, limit: 10 });
  const customer = result.customers[0];

  assert.equal(customer.carsCount, 2);
  assert.equal(customer.visitCount, 2);
  assert.equal(customer.totalSpent, 500000);
  assert.equal(customer.totalDebt, 350000);
  assert.equal(customer.rank, "Thường xuyên");
  assert.equal(customer.lastVisit.toISOString(), "2025-04-10T00:00:00.000Z");
});

test("customer list filters by BienSo through vehicle relation", async () => {
  const { service, calls } = buildService({
    customers: [],
    count: 0,
  });

  await service.getCustomerList({ BienSo: "51A-123" });

  assert.equal(calls.findMany[0].where.Xe.some.BienSo.contains, "51A-123");
});

test("customer list filters CongNo by inclusive total debt range", async () => {
  const { service, calls } = buildService({
    customers: [
      {
        MaKH: 2,
        TenChuXe: "Nguyễn Văn B",
        DienThoai: "0909009008",
        Email: "b@example.com",
        DiaChi: "Hà Nội",
        ChucVu: "KhachHang",
        TrangThai: "HoatDong",
        NgayTao: new Date("2025-01-01T00:00:00.000Z"),
        NgayCapNhat: new Date("2025-03-01T00:00:00.000Z"),
        Xe: [],
      },
    ],
    vehicles: [
      { MaKH: 1, TienNoHienTai: "50000.00" },
      { MaKH: 1, TienNoHienTai: "50000.00" },
      { MaKH: 2, TienNoHienTai: "100000.00" },
      { MaKH: 2, TienNoHienTai: "50000.00" },
      { MaKH: 3, TienNoHienTai: "300000.00" },
    ],
    count: 1,
  });

  await service.getCustomerList({ CongNoFrom: 100000, CongNoTo: 150000 });

  assert.deepEqual(calls.vehicleFindMany[0].select, {
    MaKH: true,
    TienNoHienTai: true,
  });
  assert.deepEqual(calls.findMany[0].where.MaKH.in, [1, 2]);
});
