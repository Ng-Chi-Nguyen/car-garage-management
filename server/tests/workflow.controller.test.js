import test from "node:test";
import assert from "node:assert/strict";

import { createRepairOrderWorkflowController } from "../src/controllers/workflows/repairOrderWorkflow.controller.js";

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

test("workflow controller map P2034 thanh 409 de client retry", async () => {
  const controller = createRepairOrderWorkflowController({
    create: async () => {
      const error = new Error("transaction conflict");
      error.code = "P2034";
      throw error;
    },
  });
  const res = createMockRes();

  await controller.create({ body: {} }, res);

  assert.equal(res.statusCode, 409);
  assert.equal(res.body.success, false);
  assert.match(res.body.message, /thử lại/i);
});
