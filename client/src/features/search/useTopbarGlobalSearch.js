import { useQuery } from '@tanstack/react-query';
import { searchTopbarEntities } from './topbarSearch.api';

export const TOPBAR_SEARCH_KEYS = {
  all: ['topbar-search'],
  list: (searchTerm) => [...TOPBAR_SEARCH_KEYS.all, String(searchTerm || '').trim()],
};

export function useTopbarGlobalSearch(searchTerm) {
  const normalizedTerm = String(searchTerm || '').trim();

  return useQuery({
    queryKey: TOPBAR_SEARCH_KEYS.list(normalizedTerm),
    queryFn: () => searchTopbarEntities(normalizedTerm),
    enabled: normalizedTerm.length >= 2,
    staleTime: 30_000,
  });
}
