import { useQuery } from '@tanstack/react-query';
import { fetchRepairOrderDetails } from './repairOrders.api';
import { repairOrdersKeys } from './repairOrders.queryKeys';

export function useRepairOrderDetailsQuery(id) {
  return useQuery({
    queryKey: [...repairOrdersKeys.detail(id), 'details'],
    queryFn: () => fetchRepairOrderDetails(id),
    enabled: !!id,
  });
}
