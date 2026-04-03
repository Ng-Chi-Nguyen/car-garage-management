import { useQuery } from '@tanstack/react-query';
import { fetchRepairOrder } from './repairOrders.api';
import { repairOrdersKeys } from './repairOrders.queryKeys';

export function useRepairOrderQuery(id) {
  return useQuery({
    queryKey: repairOrdersKeys.detail(id),
    queryFn: () => fetchRepairOrder(id),
    enabled: !!id,
  });
}
