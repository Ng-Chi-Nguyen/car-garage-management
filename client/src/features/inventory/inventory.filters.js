export function getInventoryFilters(searchParams) {
  return {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    page: parseInt(searchParams.get('page') || '1', 10),
  };
}

export function applyInventoryFilterUpdates(searchParams, newFilters) {
  const params = new URLSearchParams(searchParams);
  const currentFilters = getInventoryFilters(searchParams);

  Object.entries(newFilters).forEach(([key, value]) => {
    if (value === '' || value === 'all' || (key === 'page' && value === 1)) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });

  if (newFilters.search !== undefined && newFilters.search !== currentFilters.search && newFilters.page === undefined) {
      params.delete('page');
  }
  if (newFilters.category !== undefined && newFilters.category !== currentFilters.category && newFilters.page === undefined) {
      params.delete('page');
  }

  return params;
}
