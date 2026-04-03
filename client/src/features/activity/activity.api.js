import axiosClient from "../../lib/axiosClient.js";

const DEFAULT_ACTIVITY_LOGS_PAYLOAD = {
  activityLogs: [],
  pagination: {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
  },
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
};

const buildActivityParams = (filters = {}, { includePaging = true } = {}) => {
  const params = {};

  if (includePaging) {
    params.page = Number(filters.page) > 0 ? Number(filters.page) : 1;
    params.limit = Number(filters.limit) > 0 ? Number(filters.limit) : 10;
  }

  if (filters.period) {
    params.period = filters.period;
  }

  if (filters.user) {
    params.user = filters.user;
  }

  if (filters.actionType) {
    params.actionType = filters.actionType;
  }

  if (filters.status) {
    params.status = filters.status;
  }

  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }

  return params;
};

const unwrap = (response, key) => response.data?.data?.[key];

export async function fetchActivityLogs(filters = {}) {
  const response = await axiosClient.get("/api/v1/activity/logs", {
    params: buildActivityParams(filters, { includePaging: true }),
  });

  const payload = response.data?.data;

  if (!payload) {
    return DEFAULT_ACTIVITY_LOGS_PAYLOAD;
  }

  return {
    activityLogs: unwrap(response, "activityLogs") ?? [],
    pagination: payload.pagination ?? DEFAULT_ACTIVITY_LOGS_PAYLOAD.pagination,
    filters: payload.filters ?? DEFAULT_ACTIVITY_LOGS_PAYLOAD.filters,
  };
}

export async function fetchActivityStats(filters = {}) {
  const response = await axiosClient.get("/api/v1/activity/stats", {
    params: buildActivityParams(filters, { includePaging: false }),
  });

  return unwrap(response, "activityStats");
}
