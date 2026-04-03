import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const loadIndexRouteSource = () =>
  readFile(new URL("../src/routes/index.route.js", import.meta.url), "utf8");

const loadSettingsRouteSource = () =>
  readFile(new URL("../src/routes/settings.route.js", import.meta.url), "utf8");

test("settings route keeps read access under management guard", async () => {
  const indexRouteSource = await loadIndexRouteSource();

  assert.match(
    indexRouteSource,
    /app\.use\(`\$\{apiPrefixV1\}\/settings`,\s*\.\.\.requireManagementAccess,\s*settingsRoute\);/u,
    "settings route should stay mounted behind management access for read endpoints",
  );
});

test("settings mutating endpoints require Admin-only access", async () => {
  const settingsRouteSource = await loadSettingsRouteSource();

  assert.match(
    settingsRouteSource,
    /router\.(?:put|post|delete)\([\s\S]*authMiddleware\.requireRoles\(\["Admin"\]\)[\s\S]*settingsController\.(?:updateSystemParameters|createServicePrice|updateServicePrice|deleteServicePrice)/u,
    "settings write routes should add an Admin-only guard",
  );
});
