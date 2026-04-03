import test from "node:test";
import assert from "node:assert/strict";

import { createIntakeVehicleResolverService } from "../../src/services/workflows/intakeVehicleResolver.service.js";

test("intake vehicle resolver normalizes plate variants before matching", async () => {
  const seenWhere = [];
  const service = createIntakeVehicleResolverService({
    db: {
      xE: {
        findUnique: async ({ where }) => {
          seenWhere.push(where);
          return { MaXe: 12 };
        },
      },
    },
  });

  await service.resolveVehicleByPlate({ BienSo: "51G-123-45" });

  assert.deepEqual(seenWhere[0], { BienSo: "51G-123.45" });
});

test("intake workflow creates a new customer and vehicle when the plate is unknown", async () => {
  let customerCreateCalls = 0;
  let vehicleCreateCalls = 0;
  let intakeCreateCalls = 0;
  const service = createIntakeVehicleResolverService({
    db: {
      kHACH_HANG: {
        findUnique: async () => null,
        create: async ({ data }) => {
          customerCreateCalls += 1;
          return { MaKH: 21, ...data };
        },
      },
      xE: {
        findUnique: async () => null,
        create: async ({ data }) => {
          vehicleCreateCalls += 1;
          return { MaXe: 31, ...data };
        },
      },
      pHIEU_SUA_CHUA: {
        create: async ({ data }) => {
          intakeCreateCalls += 1;
          return { MaPhieuSC: 41, ...data };
        },
      },
    },
  });

  await assert.doesNotReject(
    service.createIntakeAtomic({
      intake: {
        MaKH: null,
        MaXe: null,
        MaNV: 5,
        NgayTiepNhan: new Date("2026-04-01"),
        TrangThai: "TiepNhan",
        BienSo: "51G-123.45",
        TenChuXe: "Nguyen Van A",
        DienThoai: "0900000000",
      },
    }),
  );

  assert.equal(customerCreateCalls, 1);
  assert.equal(vehicleCreateCalls, 1);
  assert.equal(intakeCreateCalls, 1);
});
