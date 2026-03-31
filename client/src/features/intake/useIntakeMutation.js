import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createIntake } from "./intake.api";
import { INTAKE_KEYS } from "./intake.queryKeys";

export function useCreateIntakeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createIntake,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTAKE_KEYS.all });
    },
  });
}
