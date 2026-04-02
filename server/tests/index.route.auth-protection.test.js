import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("index route gan middleware phu hop cho finance report", () => {
  const source = readFileSync(new URL("../src/routes/index.route.js", import.meta.url), "utf8");

  assert.match(source, /app\.use\(\`\$\{apiPrefixV1\}\/reports\/finance\`,\s*\.\.\.requireManagementAccess,\s*financeReportRoute\);/);
});
