import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { inventoryApi } from './inventory.api';
import { INVENTORY_KEYS } from './inventory.queryKeys';
import { sanitizeInventoryFilters } from './inventory.filters.js';

export function useInventoryQuery(filters) {
  const sanitizedFilters = sanitizeInventoryFilters(filters);

  return useQuery({
    queryKey: INVENTORY_KEYS.list(sanitizedFilters),
    queryFn: () => inventoryApi.getInventory(sanitizedFilters),
    placeholderData: keepPreviousData,
  });
}

export function useStockDetailQuery(id) {
  return useQuery({
    queryKey: INVENTORY_KEYS.detail(id),
    queryFn: () => inventoryApi.getStockDetail(id),
    enabled: !!id,
  });
}

export function useSuppliersQuery() {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: () => inventoryApi.getSuppliers(),
  });
}
