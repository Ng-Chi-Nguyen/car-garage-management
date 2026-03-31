import { useQuery } from "@tanstack/react-query";
import { fetchActivityLogs, fetchActivityStats } from "./activity.api";
import { ACTIVITY_KEYS } from "./activity.queryKeys";

export function useActivityLogsQuery(filters) {
  return useQuery({
    queryKey: ACTIVITY_KEYS.list(filters),
    queryFn: () => fetchActivityLogs(filters),
  });
}

export function useActivityStatsQuery() {
  return useQuery({
    queryKey: ACTIVITY_KEYS.stats(),
    queryFn: fetchActivityStats,
  });
}
