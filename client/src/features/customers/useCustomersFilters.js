import { useSearchParams } from 'react-router-dom';
import { serializeFilters, deserializeFilters } from './customers.filters.js';

export function useCustomersFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = deserializeFilters(searchParams);

  const setFilters = (newFilters) => {
    const params = serializeFilters(newFilters, filters);
    setSearchParams(params);
  };

  return { filters, setFilters };
}
