import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateDebt,
  calculateImportLineTotal,
  calculateRepairStockAdjustment,
  calculateRepairLineTotal,
  calculateImportStockAdjustment,
} from "../src/shared/crud/crudBusiness.helpers.js";

test("calculateDebt không cho công nợ âm", () => {
  assert.equal(calculateDebt(1000, 300), 700);
  assert.equal(calculateDebt(1000, 1200), 0);
});

test("calculateRepairStockAdjustment tính đúng chênh lệch tiêu hao", () => {
  assert.equal(calculateRepairStockAdjustment(5, 8), -3);
  assert.equal(calculateRepairStockAdjustment(5, 3), 2);
});

test("calculateImportStockAdjustment tính đúng chênh lệch nhập kho", () => {
  assert.equal(calculateImportStockAdjustment(5, 8), 3);
  assert.equal(calculateImportStockAdjustment(5, 3), -2);
});

test("calculateRepairLineTotal tính đúng thành tiền sửa chữa", () => {
  assert.equal(calculateRepairLineTotal(2, 100000, 50000), 250000);
});

test("calculateImportLineTotal tính đúng thành tiền nhập kho", () => {
  assert.equal(calculateImportLineTotal(3, 120000), 360000);
});
