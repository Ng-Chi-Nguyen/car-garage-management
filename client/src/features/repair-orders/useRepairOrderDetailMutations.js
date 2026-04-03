import { useMutation, useQueryClient } from '@tanstack/react-query';
import { repairOrdersKeys } from './repairOrders.queryKeys.js';
import { createRepairOrderDetail, updateRepairOrderDetail, deleteRepairOrderDetail } from './repairOrders.api.js';
import { dashboardKeys } from '../dashboard/dashboard.queryKeys.js';
import { workshopKeys } from '../workshop/workshop.queryKeys.js';

export const useCreateRepairOrderDetailMutation = (orderId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => createRepairOrderDetail({ ...payload, MaPhieuSC: orderId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: repairOrdersKeys.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: repairOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      queryClient.invalidateQueries({ queryKey: workshopKeys.all });
    },
  });
};

export const useUpdateRepairOrderDetailMutation = (orderId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ detailId, payload }) => updateRepairOrderDetail(detailId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: repairOrdersKeys.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: repairOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      queryClient.invalidateQueries({ queryKey: workshopKeys.all });
    },
  });
};

export const useDeleteRepairOrderDetailMutation = (orderId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (detailId) => deleteRepairOrderDetail(detailId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: repairOrdersKeys.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: repairOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      queryClient.invalidateQueries({ queryKey: workshopKeys.all });
    },
  });
};
