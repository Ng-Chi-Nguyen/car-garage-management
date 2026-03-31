import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSystemParameters } from "./settings.api";
import { SETTINGS_KEYS } from "./settings.queryKeys";

export const INVALIDATES_KEYS = {
  updateSystemParameters: [SETTINGS_KEYS.parameters()],
};

export function useUpdateSystemParametersMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSystemParameters,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: INVALIDATES_KEYS.updateSystemParameters[0],
      });
    },
  });
}
