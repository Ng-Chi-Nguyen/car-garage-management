import test from "node:test";
import assert from "node:assert/strict";

import adminUsersRoute from "../src/routes/admin/users.route.js";

test("admin users route exposes list, create, update, and reset endpoints", () => {
  const routes = adminUsersRoute.stack
    .filter((layer) => layer.route)
    .map((layer) => ({ path: layer.route.path, methods: layer.route.methods }));

  const paths = [...new Set(routes.map((route) => route.path))].sort();
  assert.deepEqual(paths, ["/", "/:id", "/:id/reset-password"].sort());

  const methodsByPath = routes.reduce((acc, route) => {
    acc[route.path] = { ...(acc[route.path] || {}), ...route.methods };
    return acc;
  }, {});
  assert.equal(methodsByPath["/"].post, true);
  assert.equal(methodsByPath["/"].get, true);
  assert.equal(methodsByPath["/:id"].put, true);
  assert.equal(methodsByPath["/:id/reset-password"].post, true);
});
