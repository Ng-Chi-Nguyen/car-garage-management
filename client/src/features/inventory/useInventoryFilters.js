import { useSearchParams } from 'react-router-dom';
import { getInventoryFilters, applyInventoryFilterUpdates } from './inventory.filters.js';

export function useInventoryFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = getInventoryFilters(searchParams);

  const setFilters = (newFilters) => {
    const params = applyInventoryFilterUpdates(searchParams, newFilters);
    setSearchParams(params);
  };

  return { filters, setFilters };
}
