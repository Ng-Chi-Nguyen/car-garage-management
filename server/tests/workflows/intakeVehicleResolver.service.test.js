import test from "node:test";
import assert from "node:assert/strict";

import { createIntakeVehicleResolverService } from "../../src/services/workflows/intakeVehicleResolver.service.js";

test("intake vehicle resolver returns MaXe for a matching plate", async () => {
  const service = createIntakeVehicleResolverService({
    db: {
      xE: {
        findUnique: async ({ where, select }) => {
          assert.deepEqual(where, { BienSo: "51G-123.45" });
          assert.deepEqual(select, { MaXe: true });

          return { MaXe: 12 };
        },
      },
    },
  });

  const result = await service.resolveVehicleByPlate({ BienSo: "51G-123.45" });

  assert.deepEqual(result, { MaXe: 12 });
});

test("intake vehicle resolver serializes intake note JSON into GhiChu", async () => {
  const service = createIntakeVehicleResolverService();

  const result = await service.createIntakeAtomic({
    intake: {
      MaKH: 7,
      MaXe: 12,
      MaNV: null,
      NgayTiepNhan: new Date("2026-04-01"),
      TrangThai: "TiepNhan",
      NoiDungLoi: "May khong no",
      quickTags: ["Dong co", "Khoi dong"],
      note: "Kiem tra bugi",
    },
  });

  assert.equal(result.intake.GhiChu, JSON.stringify({ quickTags: ["Dong co", "Khoi dong"], note: "Kiem tra bugi" }));
  assert.equal(result.intake.note, "Kiem tra bugi");
  assert.equal(result.intake.issueDescription, "May khong no");
});
