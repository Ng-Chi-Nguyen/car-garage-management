export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const DEFAULT_SEARCH = '';

export function getValidPage(pageStr) {
  const page = parseInt(pageStr, 10);
  return isNaN(page) || page < 1 ? DEFAULT_PAGE : page;
}

export function getValidSearch(searchStr) {
  return typeof searchStr === 'string' ? searchStr : DEFAULT_SEARCH;
}

export function normalizeFilters(searchParams) {
  const normalized = new URLSearchParams(searchParams);
  
  const page = getValidPage(normalized.get('page'));
  if (page === DEFAULT_PAGE) {
    normalized.delete('page');
  } else {
    normalized.set('page', page.toString());
  }

  const search = getValidSearch(normalized.get('search'));
  if (search === DEFAULT_SEARCH) {
    normalized.delete('search');
  } else {
    normalized.set('search', search);
  }

  return normalized;
}

export function applyFilterUpdates(prevParams, newFilters) {
  const params = new URLSearchParams(prevParams);
  
  if (newFilters.page !== undefined) {
    if (newFilters.page === DEFAULT_PAGE) {
      params.delete('page');
    } else {
      params.set('page', newFilters.page.toString());
    }
  }

  if (newFilters.search !== undefined) {
    if (newFilters.search === DEFAULT_SEARCH) {
      params.delete('search');
    } else {
      params.set('search', newFilters.search);
    }
    // Reset to page 1 on new search
    if (newFilters.search !== prevParams.get('search')) {
      params.delete('page');
    }
  }

  return params;
}
