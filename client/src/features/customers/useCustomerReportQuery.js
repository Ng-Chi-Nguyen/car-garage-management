import { useQuery } from '@tanstack/react-query';
import { customersApi } from './customers.api';
import { customersKeys } from './customers.queryKeys';

export function useCustomerReportQuery(filters) {
  return useQuery({
    queryKey: [...customersKeys.lists(), 'report', filters],
    queryFn: () => customersApi.getCustomerSummary(filters),
    keepPreviousData: true,
  });
}
