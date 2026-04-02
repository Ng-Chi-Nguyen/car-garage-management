import { useQuery } from '@tanstack/react-query';
import { customersApi } from './customers.api';
import { CUSTOMERS_KEYS } from './customers.queryKeys';

export function useCustomerReportQuery(filters) {
  return useQuery({
    queryKey: [...CUSTOMERS_KEYS.lists(), 'report', filters],
    queryFn: () => customersApi.getCustomerSummary(filters),
    keepPreviousData: true,
  });
}
