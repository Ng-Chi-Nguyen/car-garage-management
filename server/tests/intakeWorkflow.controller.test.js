import test from "node:test";
import assert from "node:assert/strict";

import { createIntakeWorkflowController } from "../src/controllers/workflows/intakeWorkflow.controller.js";

const createMockRes = () => ({
  statusCode: 200,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(payload) {
    this.body = payload;
    return this;
  },
});

test("intake workflow controller returns 201 with success payload", async () => {
  const controller = createIntakeWorkflowController({
    create: async () => ({ intake: { id: 1 }, history: [] }),
  });
  const res = createMockRes();

  await controller.create({ body: {} }, res);

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.success, true);
  assert.deepEqual(res.body.data, { intake: { id: 1 }, history: [] });
});
