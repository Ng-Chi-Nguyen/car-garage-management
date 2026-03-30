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

export function normalizeFilters(searchParams) {
    const nextParams = new URLSearchParams(searchParams);

    // Normalize status
    const status = getValidStatus(nextParams.get('status'));
    if (status === DEFAULT_STATUS) {
        nextParams.delete('status');
    } else {
        nextParams.set('status', status);
    }

    // Normalize range
    const range = getValidRange(nextParams.get('range'));
    if (range === DEFAULT_RANGE) {
        nextParams.delete('range');
    } else {
        nextParams.set('range', range);
    }

    // Normalize search
    const search = getValidSearch(nextParams.get('search'));
    if (!search) {
        nextParams.delete('search');
    } else {
        nextParams.set('search', search);
    }

    return nextParams;
}
