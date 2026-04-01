import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const loadRevenueReportSource = () =>
  readFile(new URL("../src/routes/report/revenueReport.route.js", import.meta.url), "utf8");

test("revenue report route requires auth before validation", async () => {
  const source = await loadRevenueReportSource();

  assert.match(source, /import authMiddleware from "\.\.\/\.\.\/middleware\/auth\/auth\.middleware\.js";/u);
  assert.match(source, /const managementRoles = \["Admin", "NhanVien"\];/u);
  assert.match(source, /router\.get\(\s*"\/timeseries",\s*auth\.requireAuth,\s*auth\.requireRoles\(managementRoles\),\s*validateRequest\(/su);
  assert.doesNotMatch(source, /\/\/ auth\.requireAuth/u);
  assert.doesNotMatch(source, /\/\/ auth\.requireRoles/u);
});
