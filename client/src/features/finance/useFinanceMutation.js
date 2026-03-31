import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReceivable } from "./finance.api";
import { FINANCE_KEYS } from "./finance.queryKeys";

export const INVALIDATES_KEYS = [FINANCE_KEYS.receivables()];

export function useCreateReceivableMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReceivable,
    onSuccess: () => {
      INVALIDATES_KEYS.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}
