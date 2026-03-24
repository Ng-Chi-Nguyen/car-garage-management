import test from "node:test";
import assert from "node:assert/strict";

import carBrandSchema from "../src/validator/management/carBrand.validator.js";

test("carBrand create validator từ chối client gửi Logo trực tiếp", () => {
  const { error, value } = carBrandSchema.create.body.validate({
    TenHieuXe: "Toyota",
    Logo: "https://example.com/logos/toyota.png",
  });

  assert.ok(error);
  assert.equal(value.Logo, "https://example.com/logos/toyota.png");
});

test("carBrand update validator từ chối client gửi Logo trực tiếp", () => {
  const { error, value } = carBrandSchema.update.body.validate({
    Logo: "https://example.com/logos/honda.svg",
  });

  assert.ok(error);
  assert.equal(value.Logo, "https://example.com/logos/honda.svg");
});
