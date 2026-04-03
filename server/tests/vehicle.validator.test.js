import test from "node:test";
import assert from "node:assert/strict";

import vehicleSchema from "../src/validator/management/vehicle.validator.js";

test("vehicle create validator chap nhan MauXe la chuoi optional", () => {
  const { error, value } = vehicleSchema.create.body.validate({
    BienSo: "51A-12345",
    MaHieuXe: 1,
    MaKH: 2,
    MauXe: "Đỏ",
  });

  assert.equal(error, undefined);
  assert.equal(value.MauXe, "Đỏ");
});

test("vehicle update validator chap nhan MauXe null", () => {
  const { error, value } = vehicleSchema.update.body.validate({
    MauXe: null,
  });

  assert.equal(error, undefined);
  assert.equal(value.MauXe, null);
});
