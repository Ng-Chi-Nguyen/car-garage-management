import test from "node:test";
import assert from "node:assert/strict";

import partSchema from "../src/validator/management/part.validator.js";

test("part validator cho phep stockStatus hop le", () => {
  const low = partSchema.getAll.query.validate({ stockStatus: "low" });
  const outOfStock = partSchema.getAll.query.validate({ stockStatus: "out_of_stock" });
  const inStock = partSchema.getAll.query.validate({ stockStatus: "in_stock" });

  assert.equal(low.error, undefined);
  assert.equal(outOfStock.error, undefined);
  assert.equal(inStock.error, undefined);
});

test("part validator reject stockStatus khong hop le", () => {
  const result = partSchema.getAll.query.validate({ stockStatus: "unknown" });

  assert.notEqual(result.error, undefined);
});
