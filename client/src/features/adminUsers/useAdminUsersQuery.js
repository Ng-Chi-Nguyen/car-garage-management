import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchAdminUsers } from "./adminUsers.api.js";

export function useAdminUsersQuery(params) {
  return useQuery({
    queryKey: ["adminUsers", params],
    queryFn: () => fetchAdminUsers(params),
    placeholderData: keepPreviousData,
  });
}
