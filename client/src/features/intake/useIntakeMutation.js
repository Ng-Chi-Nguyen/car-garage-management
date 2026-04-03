import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createIntake } from "./intake.api.js";
import { INTAKE_KEYS } from "./intake.queryKeys.js";

export const INVALIDATES_KEYS = [INTAKE_KEYS.all];

export function useCreateIntakeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createIntake,
    onSuccess: () => {
      INVALIDATES_KEYS.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}
