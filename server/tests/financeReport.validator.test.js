import test from "node:test";
import assert from "node:assert/strict";

import financeReportSchema from "../src/validator/report/financeReport.validator.js";

test("finance report validator chap nhan summary query hop le", () => {
  const { error, value } = financeReportSchema.getFinanceSummary.query.validate({
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

test("finance report validator chap nhan debtors query hop le va ap default", () => {
  const { error, value } = financeReportSchema.getFinanceDebtors.query.validate({
    page: "2",
    limit: "5",
    search: "  Nguyen Van A  ",
    groupBy: "customer",
  });

  assert.equal(error, undefined);
  assert.deepEqual(value, {
    page: 2,
    limit: 5,
    search: "Nguyen Van A",
    groupBy: "customer",
  });
});

test("finance report validator tu choi groupBy khong hop le", () => {
  const { error } = financeReportSchema.getFinanceDebtors.query.validate({
    groupBy: "garage",
  });

  assert.ok(error);
  assert.equal(error.details[0].path[0], "groupBy");
});

test("finance report validator tu choi page va limit khong hop le", () => {
  const { error } = financeReportSchema.getFinanceDebtors.query.validate({
    page: 0,
    limit: -1,
  });

  assert.ok(error);
  assert.match(error.message, /page|limit/);
});

test("finance report validator tu choi query key thua", () => {
  const { error } = financeReportSchema.getFinanceDebtors.query.validate({
    page: 1,
    limit: 10,
    extra: "not-allowed",
  });

  assert.ok(error);
  assert.match(error.message, /extra.*is not allowed/);
});

test("finance report validator summary tu choi granularity khong hop le", () => {
  const { error } = financeReportSchema.getFinanceSummary.query.validate({
    granularity: "week",
    from: "2026-03-01",
    to: "2026-03-31",
  });

  assert.ok(error);
  assert.equal(error.details[0].path[0], "granularity");
});

test("finance report validator summary tu choi ngay khong hop le trong lich", () => {
  const { error } = financeReportSchema.getFinanceSummary.query.validate({
    granularity: "day",
    from: "2026-02-31",
    to: "2026-03-31",
  });

  assert.ok(error);
  assert.match(error.message, /Ngày phải là lịch hợp lệ/);
});

test("finance report validator summary tu choi from lon hon to", () => {
  const { error } = financeReportSchema.getFinanceSummary.query.validate({
    granularity: "day",
    from: "2026-04-01",
    to: "2026-03-31",
  });

  assert.ok(error);
  assert.match(error.message, /from.*không được lớn hơn.*to/);
});
