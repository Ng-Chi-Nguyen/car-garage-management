export function getInventoryFilters(searchParams) {
  const stockStatus = searchParams.get('stockStatus');
  const page = Number.parseInt(searchParams.get('page') || '1', 10);

  return {
    search: searchParams.get('search') || '',
    stockStatus: ['low', 'out_of_stock', 'in_stock'].includes(stockStatus) ? stockStatus : undefined,
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

export function sanitizeInventoryFilters(filters = {}) {
  return Object.entries(filters).reduce((acc, [key, value]) => {
    if (value === null || value === undefined) {
      return acc;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '') {
        return acc;
      }
      acc[key] = trimmed;
      return acc;
    }

    acc[key] = value;
    return acc;
  }, {});
}

export function applyInventoryFilterUpdates(searchParams, newFilters) {
  const params = new URLSearchParams(searchParams);
  const currentFilters = getInventoryFilters(searchParams);

  Object.entries(newFilters).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '' || value === 'all' || (key === 'page' && value === 1)) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });

  if (newFilters.search !== undefined && newFilters.search !== currentFilters.search && newFilters.page === undefined) {
      params.delete('page');
  }
  if (newFilters.stockStatus !== undefined && newFilters.stockStatus !== currentFilters.stockStatus && newFilters.page === undefined) {
      params.delete('page');
  }

  return params;
}
