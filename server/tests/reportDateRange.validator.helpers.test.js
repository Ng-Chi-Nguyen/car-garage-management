import test from "node:test";
import assert from "node:assert/strict";

import {
  createReportRangeQuerySchema,
} from "../src/validator/report/reportDateRange.validator.helpers.js";

test("report validator helper tao schema range co granularity", () => {
  const schema = createReportRangeQuerySchema({ includeGranularity: true });
  const { error, value } = schema.validate({
    granularity: "month",
    from: "2026-01-01",
    to: "2026-03-31",
  });

  assert.equal(error, undefined);
  assert.deepEqual(value, {
    granularity: "month",
    from: "2026-01-01",
    to: "2026-03-31",
  });
});

test("report validator helper tu choi query key la", () => {
  const schema = createReportRangeQuerySchema({ includeGranularity: false });
  const { error } = schema.validate({
    from: "2026-01-01",
    to: "2026-01-31",
    unexpected: true,
  });

  assert.ok(error);
  assert.match(error.message, /unexpected.*is not allowed/);
});
