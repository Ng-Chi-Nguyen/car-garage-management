import { useSearchParams } from 'react-router-dom';
import { getValidPage, getValidSearch, applyFilterUpdates } from './repairOrders.filters';

export function useRepairOrdersFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = getValidPage(searchParams.get('page'));
  const search = getValidSearch(searchParams.get('search'));

  const setFilters = (newFilters) => {
    setSearchParams((prev) => applyFilterUpdates(prev, newFilters), { replace: true });
  };

  return {
    filters: { page, search },
    setFilters
  };
}