import { useMutation, useQueryClient } from '@tanstack/react-query';
import { repairOrdersKeys } from './repairOrders.queryKeys.js';
import { createRepairOrder } from './repairOrders.api.js';
import { FINANCE_KEYS } from '../finance/finance.queryKeys.js';
import { dashboardKeys } from '../dashboard/dashboard.queryKeys.js';
import { CUSTOMERS_KEYS } from '../customers/customers.queryKeys.js';
import { INTAKE_KEYS } from '../intake/intake.queryKeys.js';
import { workshopKeys } from '../workshop/workshop.queryKeys.js';
import { INVENTORY_KEYS } from '../inventory/inventory.queryKeys.js';

export const INVALIDATES_KEYS = [
  repairOrdersKeys.lists(),
  repairOrdersKeys.details(),
  FINANCE_KEYS.all,
  dashboardKeys.all,
  CUSTOMERS_KEYS.all,
  INTAKE_KEYS.all,
  workshopKeys.all,
  INVENTORY_KEYS.all
];

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
