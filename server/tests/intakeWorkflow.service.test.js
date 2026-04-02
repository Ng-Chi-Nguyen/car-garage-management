import test from "node:test";
import assert from "node:assert/strict";

import { createIntakeWorkflowService } from "../src/services/workflows/intakeWorkflow.service.js";

test("intake workflow service normalizes intake payload and returns empty history", async () => {
  const service = createIntakeWorkflowService();

  const result = await service.createIntakeAtomic({
    intake: {
      MaKH: 1,
      MaXe: 2,
      MaNV: 3,
      NgayTiepNhan: new Date("2026-03-25"),
      TrangThai: "TiepNhan",
      GhiChu: "Xe vao xuong",
      BienSoXe: "51G-123.45",
    },
  });

  assert.deepEqual(result, {
    intake: {
      id: 1,
      customerId: 1,
      vehicleId: 2,
      employeeId: 3,
      receivedAt: new Date("2026-03-25"),
      status: "TiepNhan",
      note: "Xe vao xuong",
      licensePlate: "51G-123.45",
    },
    history: [],
  });
});
