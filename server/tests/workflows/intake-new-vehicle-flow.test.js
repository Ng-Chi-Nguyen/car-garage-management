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

test("intake workflow correctly normalizes plate before finding vehicle", async () => {
  let vehicleFindCalls = 0;
  const service = createIntakeVehicleResolverService({
    db: {
      xE: {
        findUnique: async () => {
          vehicleFindCalls += 1;
          return null;
        },
      },
    },
  });

  await assert.rejects(
    service.resolveVehicleByPlate({ BienSo: "51G-123-45" }),
    /Không tìm thấy xe/,
  );

  assert.equal(vehicleFindCalls, 1);
});
