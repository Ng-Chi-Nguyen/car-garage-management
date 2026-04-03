import test from "node:test";
import assert from "node:assert/strict";

import { createIntakeWorkflowService } from "../services/workflows/intakeWorkflow.service.js";

test("intake workflow persists note JSON into GhiChu", async () => {
  const createdRows = [];
  const db = {
    kHACH_HANG: {
      findUnique: async () => ({ MaKH: 7 }),
    },
    xE: {
      findUnique: async () => ({ MaXe: 11, MaKH: 7 }),
    },
    pHIEU_SUA_CHUA: {
      create: async ({ data }) => {
        createdRows.push(data);
        return { MaPhieuSC: 99 };
      },
    },
  };

  const service = createIntakeWorkflowService({ db });
  const result = await service.createIntakeAtomic({
    intake: {
      MaKH: 7,
      MaXe: 11,
      MaNV: 3,
      NgayTiepNhan: new Date("2026-01-01T00:00:00.000Z"),
      TrangThai: "TiepNhan",
      NoiDungLoi: "Trầy xước nhẹ",
      quickTags: ["Trầy xước", "  "],
      note: "Cần kiểm tra",
    },
  });

  assert.equal(createdRows.length, 1);
  assert.deepEqual(createdRows[0], {
    MaXe: 11,
    MaNV: 3,
    NgaySC: new Date("2026-01-01T00:00:00.000Z"),
    TrangThai: "TiepNhan",
    NoiDungLoi: "Trầy xước nhẹ",
    GhiChu: JSON.stringify({ quickTags: ["Trầy xước"], note: "Cần kiểm tra" }),
    TongTien: 0,
  });
  assert.equal(result.intake.id, 99);
});
