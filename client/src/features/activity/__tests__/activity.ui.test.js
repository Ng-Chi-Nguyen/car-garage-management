import { test } from "node:test";
import assert from "node:assert";
import { ACTIVITY_KEYS } from "../activity.queryKeys.js";

globalThis.localStorage ??= {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const { default: axiosClient } = await import("../../../lib/axiosClient.js");
axiosClient.get = async (url) => {
  if (url === "/api/v1/activity/stats") {
    return { data: { data: { activityStats: { totalActions: 2, activeUsers: 2, successRate: "100%" } } } };
  }
  if (url === "/api/v1/activity/logs") {
    return { data: { data: { activityLogs: [{ id: "1", user: "Nhân viên #1", initials: "NN", status: "success", statusLabel: "Thành công" }] } } };
  }
  throw new Error(`Unexpected request: ${url}`);
};

const { fetchActivityLogs, fetchActivityStats } = await import("../activity.api.js");

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
  assert.equal(typeof stats.successRate, "string");
  
  const logs = await fetchActivityLogs({ period: "today" });
  assert.ok(Array.isArray(logs));
  assert.ok(logs.length > 0);
  assert.equal(typeof logs[0].id, "string");
  assert.equal(typeof logs[0].user, "string");
  assert.equal(typeof logs[0].initials, "string");
  assert.equal(typeof logs[0].status, "string");
  assert.equal(typeof logs[0].statusLabel, "string");
});
