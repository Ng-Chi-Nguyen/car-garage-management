export function deserializeFilters(searchParams) {
  const filters = {
    search: searchParams.get('search') || '',
    page: parseInt(searchParams.get('page') || '1', 10),
  };

  const minDebt = searchParams.get('minDebt');
  if (minDebt) filters.minDebt = Number(minDebt);

  const maxDebt = searchParams.get('maxDebt');
  if (maxDebt) filters.maxDebt = Number(maxDebt);

  const licensePlate = searchParams.get('licensePlate');
  if (licensePlate) filters.licensePlate = licensePlate;

  const phone = searchParams.get('phone');
  if (phone) filters.phone = phone;

  const email = searchParams.get('email');
  if (email) filters.email = email;

  return filters;
}

export function serializeFilters(newFilters, currentFilters = {}) {
  const params = new URLSearchParams();
  
  // if search/filters changed without explicitly passing a new page, it should reset page.
  // We handle it simply by not passing page if filter changed, so it resets to 1.
  const isFilterChanged = 
    (newFilters.search !== undefined && newFilters.search !== currentFilters.search) ||
    (newFilters.minDebt !== undefined && newFilters.minDebt !== currentFilters.minDebt) ||
    (newFilters.maxDebt !== undefined && newFilters.maxDebt !== currentFilters.maxDebt) ||
    (newFilters.licensePlate !== undefined && newFilters.licensePlate !== currentFilters.licensePlate) ||
    (newFilters.phone !== undefined && newFilters.phone !== currentFilters.phone) ||
    (newFilters.email !== undefined && newFilters.email !== currentFilters.email);

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
