import test from "node:test";
import assert from "node:assert/strict";

import masterDataXlsxSchema from "../src/validator/management/masterDataXlsx.validator.js";

test("masterDataXlsx validator chap nhan entity nam trong danh sach ho tro .xlsx", () => {
  const { error, value } = masterDataXlsxSchema.params.validate({
    entity: "payment-receipts",
  });

  assert.equal(error, undefined);
  assert.equal(value.entity, "payment-receipts");
});

test("masterDataXlsx validator tu choi entity ngoai pham vi ho tro", () => {
  const { error } = masterDataXlsxSchema.params.validate({
    entity: "unknown-table",
  });

  assert.ok(error);
});
