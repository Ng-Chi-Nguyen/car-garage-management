import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchRepairOrders } from './repairOrders.api';
import { repairOrdersKeys } from './repairOrders.queryKeys';

export const useRepairOrdersQuery = (params = { page: 1, limit: 10, search: '' }) => {
  return useQuery({
    queryKey: repairOrdersKeys.list(params),
    queryFn: () => fetchRepairOrders(params),
    placeholderData: keepPreviousData,
  });
};
