import test from "node:test";
import assert from "node:assert/strict";

import intakeWorkflowSchema from "../src/validator/workflows/intakeWorkflow.validator.js";

test("intake workflow validator accepts reception payload", () => {
  const payload = {
    MaKH: 1,
    MaXe: 2,
    MaNV: 3,
    NgayTiepNhan: "2026-03-25",
    TrangThai: "TiepNhan",
    GhiChu: "Xe vao xuong",
    BienSoXe: "51G-123.45",
  };

  const { error, value } = intakeWorkflowSchema.create.body.validate(payload);

  assert.equal(error, undefined);
  assert.ok(value.intake.NgayTiepNhan instanceof Date);
});

test("intake workflow validator rejects unexpected fields", () => {
  const { error } = intakeWorkflowSchema.create.body.validate({
    intake: {
      MaKH: 1,
      MaXe: 2,
      MaNV: 3,
      NgayTiepNhan: "2026-03-25",
      TrangThai: "TiepNhan",
      TongTien: 100,
    },
  });

  assert.ok(error);
  assert.match(error.message, /TongTien/);
});
