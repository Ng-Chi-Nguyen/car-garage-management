import test from "node:test";
import assert from "node:assert/strict";

import activityRoute from "../src/routes/activity.route.js";

test("activity route exposes log and stats endpoints", () => {
  const routes = activityRoute.stack
    .filter((layer) => layer.route)
    .map((layer) => layer.route.path);

  assert.deepEqual(routes.sort(), ["/logs", "/stats"].sort());
});
