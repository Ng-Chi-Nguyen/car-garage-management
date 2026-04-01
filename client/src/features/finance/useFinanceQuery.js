import { useQuery } from "@tanstack/react-query";
import { FINANCE_KEYS } from "./finance.queryKeys";
import { fetchReceivables, fetchSettlement } from "./finance.api";

export function useReceivablesQuery(params = {}) {
  return useQuery({
    queryKey: [...FINANCE_KEYS.receivables(), params],
    queryFn: () => fetchReceivables(params),
  });
}

export function useSettlementQuery(id) {
  return useQuery({
    queryKey: [...FINANCE_KEYS.settlements(), id],
    queryFn: () => fetchSettlement(id),
    enabled: !!id,
  });
}
