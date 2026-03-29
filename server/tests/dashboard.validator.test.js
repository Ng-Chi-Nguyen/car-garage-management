import test from "node:test";
import assert from "node:assert/strict";

import dashboardSchema from "../src/validator/report/dashboard.validator.js";

test("revenue summary validator chap nhan query rong", () => {
  const { error, value } = dashboardSchema.getRevenueSummary.query.validate({});

  assert.equal(error, undefined);
  assert.deepEqual(value, {});
});

test("revenue summary validator tu choi query la", () => {
  const { error } = dashboardSchema.getRevenueSummary.query.validate({
    from: "2026-03-01",
  });

  assert.ok(error);
});
