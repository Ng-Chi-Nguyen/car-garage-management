import { useQuery } from "@tanstack/react-query";
import { customersApi } from "./customers.api";
import { CUSTOMERS_KEYS } from "./customers.queryKeys";

export function useCustomersQuery(filters, options = {}) {
  return useQuery({
    queryKey: CUSTOMERS_KEYS.list(filters),
    queryFn: () => customersApi.getCustomers(filters),
    ...options,
  });
}

export function useCustomerDetailQuery(id) {
  return useQuery({
    queryKey: CUSTOMERS_KEYS.detail(id),
    queryFn: () => customersApi.getCustomerDetail(id),
    enabled: !!id,
  });
}
