import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from './inventory.api';
import { INVENTORY_KEYS } from './inventory.queryKeys';

export function useInventoryMutations() {
  const queryClient = useQueryClient();

  const createStockReceiptMutation = useMutation({
    mutationFn: inventoryApi.createStockReceipt,
    onSuccess: () => {
      // Invalidate both lists and detail queries
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.details() });
    },
  });

  return {
    createStockReceipt: createStockReceiptMutation,
  };
}
