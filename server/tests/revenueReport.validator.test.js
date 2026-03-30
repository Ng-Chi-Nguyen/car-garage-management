import test from "node:test";
import assert from "node:assert/strict";

import revenueReportSchema from "../src/validator/report/revenueReport.validator.js";

test("revenue report validator chap nhan query timeseries hop le", () => {
  const { error, value } = revenueReportSchema.getRevenueTimeseries.query.validate({
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

test("revenue report validator tu choi granularity week", () => {
  const { error } = revenueReportSchema.getRevenueTimeseries.query.validate({
    granularity: "week",
    from: "2026-03-01",
    to: "2026-03-31",
  });

  assert.ok(error);
  assert.equal(error.details[0].path[0], "granularity");
});

test("revenue report validator tu choi query key la", () => {
  const { error } = revenueReportSchema.getRevenueByPart.query.validate({
    from: "2026-03-01",
    to: "2026-03-31",
    unknown: "x",
  });

  assert.ok(error);
  assert.match(error.message, /unknown.*is not allowed/);
});
