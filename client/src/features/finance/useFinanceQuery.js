import { useQuery } from "@tanstack/react-query";
import { FINANCE_KEYS } from "./finance.queryKeys";
import { fetchReceivables, fetchSettlement, fetchReceiptHistory } from "./finance.api";

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

export function useReceiptHistoryQuery(params = {}) {
  return useQuery({
    queryKey: FINANCE_KEYS.history(params),
    queryFn: () => fetchReceiptHistory(params),
    enabled: !!params.vehicleId,
  });
}
