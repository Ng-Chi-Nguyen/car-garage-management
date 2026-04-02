import test from "node:test";
import assert from "node:assert/strict";

import adminUsersRoute from "../src/routes/admin/users.route.js";

test("admin users route exposes list and update endpoints", () => {
  const routes = adminUsersRoute.stack
    .filter((layer) => layer.route)
    .map((layer) => ({ path: layer.route.path, methods: layer.route.methods }));

  assert.deepEqual(
    routes.map((route) => route.path).sort(),
    ["/", "/:id"].sort(),
  );
  assert.equal(routes[0].methods.get || routes[1].methods.get, true);
  assert.equal(routes[0].methods.put || routes[1].methods.put, true);
});
