import { DASHBOARD_RANGES, DASHBOARD_DEFAULT_RANGE } from './dashboard.constants.js';

/**
 * Validates a range string and returns a valid range.
 * Defaults to DASHBOARD_DEFAULT_RANGE if invalid.
 */
export function getValidRange(range) {
    const validRanges = Object.values(DASHBOARD_RANGES);
    return validRanges.includes(range) ? range : DASHBOARD_DEFAULT_RANGE;
}

/**
 * Builds date range query objects for API requests.
 */
export function toDateRange(rangeType) {
    const end = new Date();
    const start = new Date();
    
    // Ensure we are working with a valid range
    const validRange = getValidRange(rangeType);

    if (validRange === DASHBOARD_RANGES.TODAY) {
        // Today from 00:00:00
        start.setHours(0, 0, 0, 0);
    } else if (validRange === DASHBOARD_RANGES.LAST_7_DAYS) {
        start.setDate(end.getDate() - 7);
    } else if (validRange === DASHBOARD_RANGES.THIS_MONTH) {
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
    } else if (validRange === DASHBOARD_RANGES.ALL_TIME) {
        // Just use a very old date for "all time"
        start.setFullYear(2000, 0, 1);
    } else {
        // Default to last 7 days
        start.setDate(end.getDate() - 7);
    }

    return {
        startDate: start.toISOString(),
        endDate: end.toISOString()
    };
}
