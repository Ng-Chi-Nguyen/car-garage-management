import { useMutation, useQueryClient } from '@tanstack/react-query';
import { repairOrdersKeys } from './repairOrders.queryKeys.js';

export const INVALIDATES_KEYS = [repairOrdersKeys.lists()];

export const useCreateRepairOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      // Stub for actual API call
      return Promise.resolve(data);
    },
    onSuccess: () => {
      INVALIDATES_KEYS.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
};