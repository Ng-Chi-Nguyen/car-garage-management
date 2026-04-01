import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReceivable } from "./finance.api.js";
import { FINANCE_KEYS } from "./finance.queryKeys.js";

export const INVALIDATES_KEYS = [FINANCE_KEYS.receivables(), FINANCE_KEYS.summary()];

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
