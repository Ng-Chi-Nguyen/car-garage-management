import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from './inventory.api';
import { INVENTORY_KEYS } from './inventory.queryKeys';

export function useInventoryQuery(filters) {
  return useQuery({
    queryKey: INVENTORY_KEYS.list(filters),
    queryFn: () => inventoryApi.getInventory(filters),
  });
}

export function useStockDetailQuery(id) {
  return useQuery({
    queryKey: INVENTORY_KEYS.detail(id),
    queryFn: () => inventoryApi.getStockDetail(id),
    enabled: !!id,
  });
}
