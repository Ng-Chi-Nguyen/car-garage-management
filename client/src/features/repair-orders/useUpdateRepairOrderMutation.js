import { useMutation, useQueryClient } from '@tanstack/react-query';
import { repairOrdersKeys } from './repairOrders.queryKeys.js';
import { updateRepairOrder } from './repairOrders.api.js';
import { dashboardKeys } from '../dashboard/dashboard.queryKeys.js';
import { workshopKeys } from '../workshop/workshop.queryKeys.js';

export const useUpdateRepairOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateRepairOrder(id, payload),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: repairOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: repairOrdersKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      queryClient.invalidateQueries({ queryKey: workshopKeys.all });
    },
  });
};
