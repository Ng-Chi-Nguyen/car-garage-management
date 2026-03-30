import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchRepairOrders } from './repairOrders.api';

export const useRepairOrdersQuery = (params = { page: 1, limit: 10, search: '' }) => {
  return useQuery({
    queryKey: ['repair-orders', params],
    queryFn: () => fetchRepairOrders(params),
    placeholderData: keepPreviousData,
  });
};
