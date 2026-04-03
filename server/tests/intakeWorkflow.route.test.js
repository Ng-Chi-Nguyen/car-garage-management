import test from "node:test";
import assert from "node:assert/strict";

import intakeWorkflowRoute from "../src/routes/workflows/intakeWorkflow.route.js";

test("intake workflow route only exposes POST /", () => {
  assert.equal(typeof intakeWorkflowRoute.handle, "function");
  assert.ok(intakeWorkflowRoute.stack.some((layer) => layer.route?.methods?.post));
});
