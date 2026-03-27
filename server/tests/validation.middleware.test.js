import test from "node:test";
import assert from "node:assert/strict";
import Joi from "joi";

import { validateRequest } from "../src/middleware/validation.middleware.js";

const runValidateRequest = (schema, target, req) =>
  new Promise((resolve, reject) => {
    const middleware = validateRequest(schema, target);

    try {
      middleware(req, {}, (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });

test("validateRequest giữ nguyên req.query và lưu dữ liệu đã convert vào req.validatedQuery", async () => {
  const req = {
    query: {
      page: "2",
    },
  };

  await runValidateRequest(
    Joi.object({
      page: Joi.number().required(),
    }),
    "query",
    req,
  );

  assert.equal(req.query.page, "2");
  assert.equal(req.validatedQuery.page, 2);
});

test("validateRequest không gán lại req.query khi query chỉ có getter", async () => {
  const queryValue = {
    page: "2",
  };
  const req = {};
  Object.defineProperty(req, "query", {
    get() {
      return queryValue;
    },
    configurable: true,
    enumerable: true,
  });

  await runValidateRequest(
    Joi.object({
      page: Joi.number().required(),
    }),
    "query",
    req,
  );

  assert.equal(req.query.page, "2");
  assert.equal(req.validatedQuery.page, 2);
});

test("validateRequest không gán lại req.params khi params chỉ có getter", async () => {
  const paramsValue = {
    id: "7",
  };
  const req = {};
  Object.defineProperty(req, "params", {
    get() {
      return paramsValue;
    },
    configurable: true,
    enumerable: true,
  });

  await runValidateRequest(
    Joi.object({
      id: Joi.number().required(),
    }),
    "params",
    req,
  );

  assert.equal(req.params.id, "7");
  assert.equal(req.validatedParams.id, 7);
});

test("validateRequest gán body đã convert vào req.body và req.validatedBody", async () => {
  const req = {
    body: {
      quantity: "3",
    },
  };

  await runValidateRequest(
    Joi.object({
      quantity: Joi.number().required(),
    }),
    "body",
    req,
  );

  assert.equal(req.body.quantity, 3);
  assert.equal(req.validatedBody.quantity, 3);
});
