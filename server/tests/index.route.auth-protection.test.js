import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("index route gan middleware phu hop cho activity va settings", () => {
  const source = readFileSync(new URL("../src/routes/index.route.js", import.meta.url), "utf8");

  assert.match(source, /const requireManagementAccess = \[[^]*?authMiddleware\.requireAuth,[^]*?authMiddleware\.requireRoles\(\["Admin", "NhanVien"\]\),[^]*?\];/u);
  assert.match(source, /app\.use\(`?\$\{apiPrefixV1\}\/master-data\/xlsx`?,\s*\.\.\.requireManagementAccess,/u);
  assert.match(source, /app\.use\(`?\$\{apiPrefixV1\}\/workflows\/intakes`?,\s*\.\.\.requireManagementAccess,\s*intakeWorkflowRoute\);/u);
  assert.match(source, /app\.use\(`?\$\{apiPrefixV1\}\/workflows\/repair-orders`?,\s*\.\.\.requireManagementAccess,\s*repairOrderWorkflowRoute\);/u);
  assert.match(source, /app\.use\(`?\$\{apiPrefixV1\}\/workflows\/stock-receipts`?,\s*\.\.\.requireManagementAccess,\s*stockReceiptWorkflowRoute\);/u);
  assert.match(source, /app\.use\(`?\$\{apiPrefixV1\}\/activity`?,\s*\.\.\.requireManagementAccess,\s*activityRoute\);/u);
  assert.match(source, /app\.use\(`?\$\{apiPrefixV1\}\/settings`?,\s*\.\.\.requireManagementAccess,\s*settingsRoute\);/u);
  assert.match(source, /app\.use\(\`\$\{apiPrefixV1\}\/reports\/finance\`,\s*\.\.\.requireManagementAccess,\s*financeReportRoute\);/);
});
