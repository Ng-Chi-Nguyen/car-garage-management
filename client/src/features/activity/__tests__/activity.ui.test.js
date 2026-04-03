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
    return {
      data: {
        data: {
          activityLogs: [{ id: "1", user: "Nhân viên #1", initials: "NN", status: "success", statusLabel: "Thành công" }],
          pagination: { page: 1, limit: 10, totalItems: 1, totalPages: 1 },
          filters: {
            period: "today",
            user: "all",
            actionType: "all",
            status: "all",
            search: "",
            userOptions: [{ value: "all", label: "Tất cả người thực hiện" }],
            actionTypeOptions: [{ value: "all", label: "Tất cả loại" }],
            statusOptions: [{ value: "all", label: "Tất cả trạng thái" }],
          },
        },
      },
    };
  }
  throw new Error(`Unexpected request: ${url}`);
};

const { fetchActivityLogs, fetchActivityStats } = await import("../activity.api.js");

test("Activity Query Keys Contract", () => {
  assert.deepEqual(ACTIVITY_KEYS.all, ["activity"]);
  assert.deepEqual(ACTIVITY_KEYS.lists(), ["activity", "list"]);
  assert.deepEqual(ACTIVITY_KEYS.list({ period: "today" }), ["activity", "list", { filters: { period: "today" } }]);
  assert.deepEqual(ACTIVITY_KEYS.stats({ period: "today" }), ["activity", "stats", { filters: { period: "today" } }]);
});

test("Activity API Contract", async () => {
  const stats = await fetchActivityStats();
  assert.ok(stats.totalActions > 0);
  assert.ok(stats.activeUsers > 0);
  assert.equal(typeof stats.successRate, "string");
  
  const logsPayload = await fetchActivityLogs({ period: "today" });
  assert.ok(Array.isArray(logsPayload.activityLogs));
  assert.ok(logsPayload.activityLogs.length > 0);
  assert.equal(typeof logsPayload.activityLogs[0].id, "string");
  assert.equal(typeof logsPayload.activityLogs[0].user, "string");
  assert.equal(typeof logsPayload.activityLogs[0].initials, "string");
  assert.equal(typeof logsPayload.activityLogs[0].status, "string");
  assert.equal(typeof logsPayload.activityLogs[0].statusLabel, "string");
  assert.equal(typeof logsPayload.pagination.totalItems, "number");
});
