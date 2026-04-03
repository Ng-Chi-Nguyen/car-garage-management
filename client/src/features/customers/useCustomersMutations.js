import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customersApi } from './customers.api';
import { CUSTOMERS_KEYS } from './customers.queryKeys';
import { toast } from 'react-toastify';

export function useCustomersMutations() {
  const queryClient = useQueryClient();

  const createCustomer = useMutation({
    mutationFn: (data) => customersApi.createCustomer(data),
    onSuccess: () => {
      toast.success('Thêm khách hàng thành công');
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_KEYS.lists() });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm khách hàng');
    }
  });

  return {
    createCustomer
  };
}
