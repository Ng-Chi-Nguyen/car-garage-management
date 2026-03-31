import { test } from "node:test";
import assert from "node:assert";
import { ACTIVITY_KEYS } from "../activity.queryKeys.js";
import { fetchActivityLogs, fetchActivityStats } from "../activity.api.js";

test("Activity Query Keys Contract", () => {
  assert.deepEqual(ACTIVITY_KEYS.all, ["activity"]);
  assert.deepEqual(ACTIVITY_KEYS.lists(), ["activity", "list"]);
  assert.deepEqual(ACTIVITY_KEYS.list({ period: "today" }), ["activity", "list", { filters: { period: "today" } }]);
  assert.deepEqual(ACTIVITY_KEYS.stats(), ["activity", "stats"]);
});

test("Activity API Contract", async () => {
  const stats = await fetchActivityStats();
  assert.ok(stats.totalActions > 0);
  assert.ok(stats.activeUsers > 0);
  
  const logs = await fetchActivityLogs({ period: "today" });
  assert.ok(Array.isArray(logs));
  assert.ok(logs.length > 0);
  assert.ok(logs[0].user !== undefined);
});
