import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from './inventory.api.js';
import { INVENTORY_KEYS, SUPPLIER_KEYS } from './inventory.queryKeys.js';

export const REPORT_INVENTORY_KEY_PREFIX = ['reports', 'inventory'];

export function useInventoryMutations() {
  const queryClient = useQueryClient();

  const createPartMutation = useMutation({
    mutationFn: inventoryApi.createPart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: REPORT_INVENTORY_KEY_PREFIX });
    },
  });

  const updatePartMutation = useMutation({
    mutationFn: ({ id, payload }) => inventoryApi.updatePart(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.details() });
      queryClient.invalidateQueries({ queryKey: REPORT_INVENTORY_KEY_PREFIX });
    },
  });

  const deletePartMutation = useMutation({
    mutationFn: (id) => inventoryApi.deletePart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.details() });
      queryClient.invalidateQueries({ queryKey: REPORT_INVENTORY_KEY_PREFIX });
    },
  });

  const createSupplierMutation = useMutation({
    mutationFn: inventoryApi.createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIER_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SUPPLIER_KEYS.details() });
    },
  });

  const createStockReceiptMutation = useMutation({
    mutationFn: inventoryApi.createStockReceipt,
    onSuccess: () => {
      // Invalidate both lists and detail queries
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.details() });
      queryClient.invalidateQueries({ queryKey: REPORT_INVENTORY_KEY_PREFIX });
    },
  });

  return {
    createPart: createPartMutation,
    updatePart: updatePartMutation,
    deletePart: deletePartMutation,
    createSupplier: createSupplierMutation,
    createStockReceipt: createStockReceiptMutation,
  };
}
