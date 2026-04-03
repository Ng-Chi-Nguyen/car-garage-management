import test from "node:test";
import assert from "node:assert/strict";

import settingsRoute from "../src/routes/settings.route.js";

test("settings route exposes parameter, service price, and car brand endpoints", () => {
  const routes = settingsRoute.stack
    .filter((layer) => layer.route)
    .map((layer) => layer.route.path);

  assert.deepEqual(routes.sort(), ["/car-brands", "/parameters", "/parameters", "/service-prices"].sort());
});
