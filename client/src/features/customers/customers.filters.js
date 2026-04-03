export function deserializeFilters(searchParams) {
  const filters = {
    search: searchParams.get('search') || '',
    page: parseInt(searchParams.get('page') || '1', 10),
  };

  return filters;
}

export function serializeFilters(newFilters, currentFilters = {}) {
  const params = new URLSearchParams();
  
  // if search/filters changed without explicitly passing a new page, it should reset page.
  // We handle it simply by not passing page if filter changed, so it resets to 1.
  const isFilterChanged = 
    (newFilters.search !== undefined && newFilters.search !== currentFilters.search);

  let mergedFilters = { ...currentFilters, ...newFilters };

  if (isFilterChanged && newFilters.page === undefined) {
    mergedFilters.page = 1;
  }

  Object.entries(mergedFilters).forEach(([key, value]) => {
    if (value === '' || value === undefined || value === null || (key === 'page' && value === 1)) {
      // skip
    } else {
      params.set(key, value);
    }
  });

  return params;
}
