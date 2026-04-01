import { useMutation, useQueryClient } from '@tanstack/react-query';
import { repairOrdersKeys } from './repairOrders.queryKeys.js';
import { createRepairOrder } from './repairOrders.api.js';

export const INVALIDATES_KEYS = [repairOrdersKeys.lists()];

export const useCreateRepairOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRepairOrder,
    onSuccess: () => {
      INVALIDATES_KEYS.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
};
