import test from "node:test";
import assert from "node:assert/strict";

import inventoryReportSchema from "../src/validator/report/inventoryReport.validator.js";

test("inventory report validator chap nhan query hop le", () => {
  const { error, value } = inventoryReportSchema.getInventorySummary.query.validate({
    from: "2026-03-01",
    to: "2026-03-31",
  });

  assert.equal(error, undefined);
  assert.deepEqual(value, {
    from: "2026-03-01",
    to: "2026-03-31",
  });
});

test("inventory report validator tu choi from lon hon to", () => {
  const { error } = inventoryReportSchema.getInventorySummary.query.validate({
    from: "2026-04-01",
    to: "2026-03-31",
  });

  assert.ok(error);
  assert.match(error.message, /from.*kh/);
});

test("inventory report validator tu choi key thua", () => {
  const { error } = inventoryReportSchema.getInventorySummary.query.validate({
    from: "2026-03-01",
    to: "2026-03-31",
    extra: "x",
  });

  assert.ok(error);
  assert.match(error.message, /extra.*is not allowed/);
});
