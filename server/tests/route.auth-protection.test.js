import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const loadIndexRouteSource = () =>
  readFile(new URL("../src/routes/index.route.js", import.meta.url), "utf8");

test("index route protects activity, settings, repair-orders, finance reports, and payment receipts", async () => {
  const indexRouteSource = await loadIndexRouteSource();

  assert.match(
    indexRouteSource,
    /app\.use\(`\$\{apiPrefixV1\}\/dashboard`,\s*\.\.\.dashboardAccessMiddlewares,\s*dashboardRoute\);/u,
    "dashboard route should be protected by dashboardAccessMiddlewares",
  );

  assert.match(
    indexRouteSource,
    /app\.use\(`\$\{apiPrefixV1\}\/activity`,\s*\.\.\.requireManagementAccess,\s*activityRoute\);/u,
    "activity route should be protected by requireManagementAccess",
  );
  assert.match(
    indexRouteSource,
    /app\.use\(`\$\{apiPrefixV1\}\/settings`,\s*\.\.\.requireManagementAccess,\s*settingsRoute\);/u,
    "settings route should be protected by requireManagementAccess",
  );
  assert.match(
    indexRouteSource,
    /app\.use\(`\$\{apiPrefixV1\}\/repair-orders`,\s*\.\.\.requireManagementAccess,\s*repairOrderRoute\);/u,
    "repair-orders route should be protected",
  );
  assert.match(
    indexRouteSource,
    /app\.use\(`\$\{apiPrefixV1\}\/payment-receipts`,\s*\.\.\.requireManagementAccess,\s*paymentReceiptRoute\);/u,
    "payment-receipts route should be protected",
  );
  assert.match(
    indexRouteSource,
    /app\.use\(`\$\{apiPrefixV1\}\/reports\/finance`,\s*\.\.\.requireManagementAccess,\s*financeReportRoute\);/u,
    "finance reports route should be protected",
  );
  assert.doesNotMatch(
    indexRouteSource,
    /app\.use\(`\$\{apiPrefixV1\}\/workflows\/payment-receipts`/u,
    "workflow payment-receipts route should not be mounted in the canonical route table",
  );
  assert.doesNotMatch(
    indexRouteSource,
    /\/\/ app\.use\(`\$\{apiPrefixV1\}\/workflows\/payment-receipts`/u,
    "dead workflow payment-receipts route comments should be removed",
  );
});
