import test from "node:test";
import assert from "node:assert/strict";

import intakeWorkflowSchema from "../../src/validator/workflows/intakeWorkflow.validator.js";

test("intake workflow validator accepts resolver-first intake payload", () => {
  const { error, value } = intakeWorkflowSchema.create.body.validate({
    intake: {
      MaKH: 1,
      MaXe: 2,
      MaNV: 3,
      NgayTiepNhan: "2026-04-01",
      TrangThai: "TiepNhan",
      NoiDungLoi: "May khong no",
      quickTags: ["Dong co"],
      note: "Kiem tra bugi",
    },
  });

  assert.equal(error, undefined);
  assert.equal(value.intake.MaXe, 2);
  assert.deepEqual(value.intake.quickTags, ["Dong co"]);
});

test("intake workflow validator rejects legacy BienSoXe payload", () => {
  const { error } = intakeWorkflowSchema.create.body.validate({
    intake: {
      MaKH: 1,
      MaXe: 2,
      NgayTiepNhan: "2026-04-01",
      NoiDungLoi: "May khong no",
      BienSoXe: "51G-123.45",
    },
  });

  assert.ok(error);
  assert.match(error.message, /BienSoXe/);
});
