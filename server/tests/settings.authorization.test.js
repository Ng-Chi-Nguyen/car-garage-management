import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("settings route keeps reads for management roles and mutations admin-only", async () => {
  const source = await readFile(new URL("../src/routes/settings.route.js", import.meta.url), "utf8");

  assert.match(source, /const managementRoles = \["Admin", "NhanVien"\];/u);
  assert.match(source, /const adminRoles = \["Admin"\];/u);
  assert.match(source, /router\.get\("\/parameters",\s*authMiddleware\.requireRoles\(managementRoles\),\s*settingsController\.getSystemParameters\);/u);
  assert.match(source, /router\.put\(\s*"\/parameters",\s*authMiddleware\.requireRoles\(adminRoles\),\s*validateRequest\(settingsSchema\.update, "body"\),\s*settingsController\.updateSystemParameters,/u);
  assert.match(source, /router\.post\(\s*"\/service-prices",\s*authMiddleware\.requireRoles\(adminRoles\),\s*validateRequest\(settingsSchema\.createServicePrice\.body, "body"\),\s*settingsController\.createServicePrice,/u);
  assert.match(source, /router\.put\(\s*"\/service-prices\/:id",\s*authMiddleware\.requireRoles\(adminRoles\),\s*validateRequest\(settingsSchema\.updateServicePrice\.params, "params"\),\s*validateRequest\(settingsSchema\.updateServicePrice\.body, "body"\),\s*settingsController\.updateServicePrice,/u);
  assert.match(source, /router\.delete\(\s*"\/service-prices\/:id",\s*authMiddleware\.requireRoles\(adminRoles\),\s*validateRequest\(settingsSchema\.deleteServicePrice\.params, "params"\),\s*settingsController\.deleteServicePrice,/u);
});
