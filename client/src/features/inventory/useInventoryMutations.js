import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from './inventory.api';
import { INVENTORY_KEYS } from './inventory.queryKeys';

export function useInventoryMutations() {
  const queryClient = useQueryClient();

  const createPartMutation = useMutation({
    mutationFn: inventoryApi.createPart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.lists() });
    },
  });

  const createStockReceiptMutation = useMutation({
    mutationFn: inventoryApi.createStockReceipt,
    onSuccess: () => {
      // Invalidate both lists and detail queries
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.details() });
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.stats() });
    },
  });

  return {
    createPart: createPartMutation,
    createStockReceipt: createStockReceiptMutation,
  };
}
