import test from "node:test";
import assert from "node:assert/strict";
import Joi from "joi";

import { validateRequest } from "../src/middleware/validation.middleware.js";

test("validateRequest ghi đè req.query bằng giá trị đã Joi convert", async () => {
  const req = {
    query: {
      page: "2",
    },
  };

  await new Promise((resolve, reject) => {
    validateRequest(
      Joi.object({
        page: Joi.number().required(),
      }),
      "query",
    )(req, {}, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

  assert.equal(req.query.page, 2);
  assert.equal(req.validatedQuery.page, 2);
});
