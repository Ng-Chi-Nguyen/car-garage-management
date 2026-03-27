/**
 * Builds date range query objects for API requests.
 */
export function toDateRange(rangeType) {
    const end = new Date();
    const start = new Date();

    if (rangeType === '7days') {
        start.setDate(end.getDate() - 7);
    } else if (rangeType === '30days') {
        start.setDate(end.getDate() - 30);
    } else if (rangeType === 'thisMonth') {
        start.setDate(1);
    } else {
        // Default to last 7 days
        start.setDate(end.getDate() - 7);
    }

    return {
        startDate: start.toISOString(),
        endDate: end.toISOString()
    };
}
