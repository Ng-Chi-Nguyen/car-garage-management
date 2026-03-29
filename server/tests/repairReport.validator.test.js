import test from "node:test";
import assert from "node:assert/strict";

import repairReportSchema from "../src/validator/report/repairReport.validator.js";

test("repair report validator chap nhan query hop le", () => {
  const { error, value } = repairReportSchema.getRepairSummary.query.validate({
    granularity: "day",
    from: "2026-03-01",
    to: "2026-03-31",
  });

  assert.equal(error, undefined);
  assert.deepEqual(value, {
    granularity: "day",
    from: "2026-03-01",
    to: "2026-03-31",
  });
});

test("repair report validator tu choi granularity week", () => {
  const { error } = repairReportSchema.getRepairSummary.query.validate({
    granularity: "week",
    from: "2026-03-01",
    to: "2026-03-31",
  });

  assert.ok(error);
  assert.equal(error.details[0].path[0], "granularity");
});

test("repair report validator tu choi ngay khong hop le trong lich", () => {
  const { error } = repairReportSchema.getRepairSummary.query.validate({
    granularity: "day",
    from: "2026-02-31",
    to: "2026-03-31",
  });

  assert.ok(error);
  assert.match(error.message, /Ngày phải là lịch hợp lệ/);
});

test("repair report validator tu choi from lon hon to", () => {
  const { error } = repairReportSchema.getRepairSummary.query.validate({
    granularity: "day",
    from: "2026-04-01",
    to: "2026-03-31",
  });

  assert.ok(error);
  assert.match(error.message, /from.*không được lớn hơn.*to/);
});

test("repair report validator tu choi query key khong duoc dinh nghia", () => {
  const { error } = repairReportSchema.getRepairSummary.query.validate({
    granularity: "day",
    from: "2026-03-01",
    to: "2026-03-31",
    extra: "not-allowed",
  });

  assert.ok(error);
  assert.match(error.message, /extra.*is not allowed/);
});
