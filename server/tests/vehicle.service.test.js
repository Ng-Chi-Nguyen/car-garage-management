import test from "node:test";
import assert from "node:assert/strict";

import prisma from "../src/db/prisma.js";
import vehicleService, {
  VEHICLE_INCLUDE_RELATIONS,
} from "../src/services/management/vehicle.service.js";

test("vehicleService getVehicleList include hieu xe va khach hang", async () => {
  const originalTransaction = prisma.$transaction;
  const originalCount = prisma.xE.count;
  const originalFindMany = prisma.xE.findMany;
  const calls = {
    count: null,
    findMany: null,
  };

  prisma.xE.count = async (args) => {
    calls.count = args;
    return 1;
  };
  prisma.xE.findMany = async (args) => {
    calls.findMany = args;
    return [
      {
        MaXe: 90,
        BienSo: "18L-10090",
        MauXe: "Vios",
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
  };
  prisma.$transaction = async (operations) => Promise.all(operations);

  try {
    const result = await vehicleService.getVehicleList({});

    assert.deepEqual(calls.count, { where: {} });
    assert.deepEqual(calls.findMany.include, VEHICLE_INCLUDE_RELATIONS);
    assert.equal(result.vehicles[0].MauXe, "Vios");
    assert.equal(result.vehicles[0].HieuXe.TenHieuXe, "Toyota");
    assert.equal(result.vehicles[0].KhachHang.TenChuXe, "Le Van Tet");
  } finally {
    prisma.$transaction = originalTransaction;
    prisma.xE.count = originalCount;
    prisma.xE.findMany = originalFindMany;
  }
});

test("vehicleService getVehicleById include hieu xe va khach hang", async () => {
  const originalFindUnique = prisma.xE.findUnique;
  let receivedArgs = null;

  prisma.xE.findUnique = async (args) => {
    receivedArgs = args;
    return {
      MaXe: 90,
      BienSo: "18L-10090",
      MauXe: "Civic",
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
  };

  try {
    const result = await vehicleService.getVehicleById(90);

    assert.deepEqual(receivedArgs.include, VEHICLE_INCLUDE_RELATIONS);
    assert.equal(result.MauXe, "Civic");
    assert.equal(result.HieuXe.TenHieuXe, "Toyota");
    assert.equal(result.KhachHang.TenChuXe, "Le Van Tet");
  } finally {
    prisma.xE.findUnique = originalFindUnique;
  }
});

test("vehicleService createVehicle ghi MauXe model khi duoc cung cap", async () => {
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
      MauXe: "CX-5",
    });

    assert.equal(receivedArgs.data.MauXe, "CX-5");
    assert.equal(result.MauXe, "CX-5");
  } finally {
    prisma.xE.create = originalCreate;
  }
});

test("vehicleService updateVehicle ghi MauXe null khi xoa model xe", async () => {
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
