import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const loadFinanceReportSource = () =>
  readFile(new URL("../src/routes/report/financeReport.route.js", import.meta.url), "utf8");

test("finance report route requires auth before validation", async () => {
  const source = await loadFinanceReportSource();

  assert.match(source, /import authMiddleware from "\.\.\/\.\.\/middleware\/auth\/auth\.middleware\.js";/u);
  assert.match(source, /const managementRoles = \["Admin", "NhanVien"\];/u);
  assert.match(source, /router\.get\(\s*"\/summary",\s*auth\.requireAuth,\s*auth\.requireRoles\(managementRoles\),\s*validateRequest\(/su);
  assert.match(source, /router\.get\(\s*"\/debtors",\s*auth\.requireAuth,\s*auth\.requireRoles\(managementRoles\),\s*validateRequest\(/su);
});
