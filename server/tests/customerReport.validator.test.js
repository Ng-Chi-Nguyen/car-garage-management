import test from "node:test";
import assert from "node:assert/strict";

import customerReportSchema from "../src/validator/report/customerReport.validator.js";

test("customer report validator chap nhan query hop le", () => {
  const { error, value } = customerReportSchema.getCustomerSummary.query.validate({
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

test("customer report validator tu choi granularity week", () => {
  const { error } = customerReportSchema.getCustomerSummary.query.validate({
    granularity: "week",
    from: "2026-03-01",
    to: "2026-03-31",
  });

  assert.ok(error);
  assert.equal(error.details[0].path[0], "granularity");
});

test("customer report validator tu choi ngay khong hop le trong lich", () => {
  const { error } = customerReportSchema.getCustomerSummary.query.validate({
    granularity: "day",
    from: "2026-02-31",
    to: "2026-03-31",
  });

  assert.ok(error);
  assert.match(error.message, /Ngày phải là lịch hợp lệ/);
});

test("customer report validator tu choi from lon hon to", () => {
  const { error } = customerReportSchema.getCustomerSummary.query.validate({
    granularity: "day",
    from: "2026-04-01",
    to: "2026-03-31",
  });

  assert.ok(error);
  assert.match(error.message, /from.*không được lớn hơn.*to/);
});

test("customer report validator tu choi query key khong duoc dinh nghia", () => {
  const { error } = customerReportSchema.getCustomerSummary.query.validate({
    granularity: "day",
    from: "2026-03-01",
    to: "2026-03-31",
    extra: "not-allowed",
  });

  assert.ok(error);
  assert.match(error.message, /extra.*is not allowed/);
});
