import axiosClient from "../../lib/axiosClient.js";

const unwrap = (response, key) => response.data?.data?.[key];

export async function fetchActivityLogs() {
  const response = await axiosClient.get("/api/v1/activity/logs");
  return unwrap(response, "activityLogs");
}

export async function fetchActivityStats() {
  const response = await axiosClient.get("/api/v1/activity/stats");
  return unwrap(response, "activityStats");
}
