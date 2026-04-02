import test from "node:test";
import assert from "node:assert/strict";

const ensureTestDatabaseUrl = () => {
  process.env.DATABASE_URL ??= "mysql://tester:secret@127.0.0.1:3306/garage_test";
};

const loadVehicleService = async () => {
  ensureTestDatabaseUrl();
  const module = await import("../src/services/management/vehicle.service.js");
  return module;
};

test("vehicleService getVehicleList include hieu xe va khach hang", async () => {
  const { createVehicleService, VEHICLE_INCLUDE_RELATIONS } = await loadVehicleService();
  const calls = {
    count: null,
    findMany: null,
  };
  const db = {
    xE: {
      count: async (args) => {
        calls.count = args;
        return 1;
      },
      findMany: async (args) => {
        calls.findMany = args;
        return [
          {
            MaXe: 90,
            BienSo: "18L-10090",
            MaHieuXe: 10,
            MaKH: 35,
            HieuXe: {
              MaHieuXe: 10,
              TenHieuXe: "Toyota",
            },
            KhachHang: {
              MaKH: 35,
              TenChuXe: "Le Van Tet",
              DienThoai: "0818181818",
            },
          },
        ];
      },
    },
    $transaction: async (operations) => Promise.all(operations),
  };

  const vehicleService = createVehicleService({ db });

  const result = await vehicleService.getVehicleList({});

  assert.deepEqual(calls.count, { where: {} });
  assert.deepEqual(calls.findMany.include, VEHICLE_INCLUDE_RELATIONS);
  assert.equal(result.vehicles[0].HieuXe.TenHieuXe, "Toyota");
  assert.equal(result.vehicles[0].KhachHang.TenChuXe, "Le Van Tet");
});

test("vehicleService getVehicleById include hieu xe va khach hang", async () => {
  const { createVehicleService, VEHICLE_INCLUDE_RELATIONS } = await loadVehicleService();
  let receivedArgs = null;
  const db = {
    xE: {
      findUnique: async (args) => {
        receivedArgs = args;
        return {
          MaXe: 90,
          BienSo: "18L-10090",
          MaHieuXe: 10,
          MaKH: 35,
          HieuXe: {
            MaHieuXe: 10,
            TenHieuXe: "Toyota",
          },
          KhachHang: {
            MaKH: 35,
            TenChuXe: "Le Van Tet",
            DienThoai: "0818181818",
          },
        };
      },
    },
  };

  const vehicleService = createVehicleService({ db });

  const result = await vehicleService.getVehicleById(90);

  assert.deepEqual(receivedArgs.include, VEHICLE_INCLUDE_RELATIONS);
  assert.equal(result.HieuXe.TenHieuXe, "Toyota");
  assert.equal(result.KhachHang.TenChuXe, "Le Van Tet");
});
