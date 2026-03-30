export const WORKSHOP_STATUS = {
    ALL: 'all',
    WAITING: 'waiting',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed'
};

export const WORKSHOP_RANGE = {
    TODAY: 'today',
    LAST_7_DAYS: '7d',
    LAST_30_DAYS: '30d',
    LAST_90_DAYS: '90d',
    THIS_MONTH: 'this_month',
    ALL_TIME: 'all'
};

export const DEFAULT_STATUS = WORKSHOP_STATUS.ALL;
export const DEFAULT_RANGE = WORKSHOP_RANGE.LAST_7_DAYS;

export function getValidStatus(status) {
    const validStatuses = Object.values(WORKSHOP_STATUS);
    return validStatuses.includes(status) ? status : DEFAULT_STATUS;
}

export function getValidRange(range) {
    const validRanges = Object.values(WORKSHOP_RANGE);
    return validRanges.includes(range) ? range : DEFAULT_RANGE;
}

export function getValidSearch(search) {
    if (typeof search !== 'string' || !search) return '';
    const trimmed = search.trim();
    if (!trimmed) return '';
    return trimmed.slice(0, 100);
}

export function getValidPage(page) {
    const p = parseInt(page, 10);
    return !isNaN(p) && p > 0 ? p : 1;
}

export function applyFilterUpdates(prevParams, newFilters) {
    const nextParams = new URLSearchParams(prevParams);

    if (newFilters.status !== undefined) nextParams.set('status', newFilters.status);
    if (newFilters.range !== undefined) nextParams.set('range', newFilters.range);
    if (newFilters.search !== undefined) nextParams.set('search', newFilters.search);
    if (newFilters.page !== undefined) nextParams.set('page', newFilters.page.toString());

    if ((newFilters.status !== undefined || newFilters.range !== undefined || newFilters.search !== undefined) && newFilters.page === undefined) {
        nextParams.set('page', '1');
    }

    return normalizeFilters(nextParams);
}

export function normalizeFilters(searchParams) {
    const nextParams = new URLSearchParams(searchParams);

    const status = getValidStatus(nextParams.get('status'));
    if (status === DEFAULT_STATUS) {
        nextParams.delete('status');
    } else {
        nextParams.set('status', status);
    }

    const range = getValidRange(nextParams.get('range'));
    if (range === DEFAULT_RANGE) {
        nextParams.delete('range');
    } else {
        nextParams.set('range', range);
    }

    const search = getValidSearch(nextParams.get('search'));
    if (!search) {
        nextParams.delete('search');
    } else {
        nextParams.set('search', search);
    }

    const page = getValidPage(nextParams.get('page'));
    if (page === 1) {
        nextParams.delete('page');
    } else {
        nextParams.set('page', page.toString());
    }

    return nextParams;
}

export function buildQueryString(params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        
        if (Array.isArray(value)) {
            value.forEach(item => searchParams.append(key, item));
        } else {
            searchParams.append(key, value);
        }
    });
    return searchParams.toString();
}