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

test("vehicleService createVehicle writes MauXe", async () => {
  const { createVehicleService } = await loadVehicleService();
  let receivedData = null;
  const db = {
    xE: {
      create: async (args) => {
        receivedData = args.data;
        return args.data;
      },
    },
  };

  const vehicleService = createVehicleService({ db });

  await vehicleService.createVehicle({
    BienSo: "51A-12345",
    MaHieuXe: 10,
    MaKH: 35,
    MauXe: "Trắng",
  });

  assert.equal(receivedData.MauXe, "Trắng");
});

test("vehicleService updateVehicle writes MauXe", async () => {
  const { createVehicleService } = await loadVehicleService();
  let receivedData = null;
  const db = {
    xE: {
      findUnique: async () => ({ MaXe: 90 }),
      update: async (args) => {
        receivedData = args.data;
        return args.data;
      },
    },
  };

  const vehicleService = createVehicleService({ db });

  await vehicleService.updateVehicle(90, {
    MauXe: "Đen",
  });

  assert.equal(receivedData.MauXe, "Đen");
});

test("vehicleService getVehicleList returns MauXe", async () => {
  const { createVehicleService } = await loadVehicleService();
  const db = {
    xE: {
      count: async () => 1,
      findMany: async () => [
        {
          MaXe: 90,
          BienSo: "18L-10090",
          MaHieuXe: 10,
          MaKH: 35,
          MauXe: "Xanh",
        },
      ],
    },
    $transaction: async (operations) => Promise.all(operations),
  };

  const vehicleService = createVehicleService({ db });

  const result = await vehicleService.getVehicleList({});

  assert.equal(result.vehicles[0].MauXe, "Xanh");
});

test("vehicleService getVehicleById returns MauXe", async () => {
  const { createVehicleService } = await loadVehicleService();
  const db = {
    xE: {
      findUnique: async () => ({
        MaXe: 90,
        BienSo: "18L-10090",
        MauXe: "Đen",
        MaHieuXe: 10,
        MaKH: 35,
        MauXe: "Bạc",
      }),
    },
  };

  const vehicleService = createVehicleService({ db });

  const result = await vehicleService.getVehicleById(90);

  assert.equal(result.MauXe, "Bạc");
});

test("vehicleService createVehicle ghi MauXe khi duoc cung cap", async () => {
  const originalCreate = prisma.xE.create;
  let receivedArgs = null;

  prisma.xE.create = async (args) => {
    receivedArgs = args;
    return {
      MaXe: 91,
      ...args.data,
    };
  };

  try {
    const result = await vehicleService.createVehicle({
      BienSo: "51A-67890",
      MaHieuXe: 11,
      MaKH: 36,
      MauXe: "Trắng",
    });

    assert.equal(receivedArgs.data.MauXe, "Trắng");
    assert.equal(result.MauXe, "Trắng");
  } finally {
    prisma.xE.create = originalCreate;
  }
});

test("vehicleService updateVehicle ghi MauXe null khi xoa mau xe", async () => {
  const originalFindUnique = prisma.xE.findUnique;
  const originalUpdate = prisma.xE.update;
  let receivedArgs = null;

  prisma.xE.findUnique = async () => ({
    MaXe: 91,
    BienSo: "51A-67890",
    MaHieuXe: 11,
    MaKH: 36,
  });
  prisma.xE.update = async (args) => {
    receivedArgs = args;
    return {
      MaXe: 91,
      BienSo: "51A-67890",
      MaHieuXe: 11,
      MaKH: 36,
      ...args.data,
    };
  };

  try {
    const result = await vehicleService.updateVehicle(91, {
      MauXe: null,
    });

    assert.equal(receivedArgs.data.MauXe, null);
    assert.equal(result.MauXe, null);
  } finally {
    prisma.xE.findUnique = originalFindUnique;
    prisma.xE.update = originalUpdate;
  }
});
