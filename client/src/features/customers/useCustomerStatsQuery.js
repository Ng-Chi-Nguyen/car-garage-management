import { useQuery } from '@tanstack/react-query';
import { customersApi } from './customers.api';
import { CUSTOMERS_KEYS } from './customers.queryKeys';

export function useCustomerStatsQuery(filters = {}) {
  return useQuery({
    queryKey: CUSTOMERS_KEYS.stats(filters),
    queryFn: () => customersApi.getCustomerStats(filters),
    staleTime: 5 * 60 * 1000,
  });
}
