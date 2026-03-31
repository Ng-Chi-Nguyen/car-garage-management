import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReceivable } from "./finance.api";
import { FINANCE_KEYS } from "./finance.queryKeys";

export function useCreateReceivableMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReceivable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.receivables() });
    },
  });
}
