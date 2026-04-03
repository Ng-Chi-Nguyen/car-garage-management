import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const loadIndexRouteSource = () =>
  readFile(new URL("../src/routes/index.route.js", import.meta.url), "utf8");

test("admin users route is mounted under Admin-only access", async () => {
  const indexRouteSource = await loadIndexRouteSource();

  assert.match(
    indexRouteSource,
    /app\.use\(`\$\{apiPrefixV1\}\/admin\/users`,\s*\.\.\.authMiddleware\.requireRoles\(\["Admin"\]\),\s*adminUsersRoute\);/u,
    "admin users route should be mounted with Admin-only access",
  );
});
