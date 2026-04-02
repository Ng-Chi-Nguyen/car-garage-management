import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminUser } from "./adminUsers.api.js";

export function useUpdateAdminUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateAdminUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });
}
