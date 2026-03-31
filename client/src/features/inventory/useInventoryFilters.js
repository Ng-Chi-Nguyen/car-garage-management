import { useSearchParams } from 'react-router-dom';

export function useInventoryFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    page: parseInt(searchParams.get('page') || '1', 10),
  };

  const setFilters = (newFilters) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === '' || value === 'all' || (key === 'page' && value === 1)) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    if (newFilters.search !== undefined && newFilters.search !== filters.search && newFilters.page === undefined) {
        params.delete('page');
    }
    if (newFilters.category !== undefined && newFilters.category !== filters.category && newFilters.page === undefined) {
        params.delete('page');
    }

    setSearchParams(params);
  };

  return { filters, setFilters };
}
