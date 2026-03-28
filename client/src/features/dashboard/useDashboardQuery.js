import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchDashboardData } from './dashboard.api.js';
import { dashboardKeys } from './dashboard.queryKeys.js';
import { getValidRange } from './dashboard.dateRange.js';

export function useDashboardQuery() {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Read and validate range from URL
    const urlRange = searchParams.get('range');
    const range = getValidRange(urlRange);

    // Guard: sync URL if it contains an invalid or missing range
    useEffect(() => {
        if (urlRange !== range) {
            setSearchParams(prev => {
                prev.set('range', range);
                return prev;
            }, { replace: true });
        }
    }, [urlRange, range, setSearchParams]);

    const setRange = (newRange) => {
        setSearchParams(prev => {
            const validNewRange = getValidRange(newRange);
            prev.set('range', validNewRange);
            return prev;
        });
    };

    const query = useQuery({
        queryKey: dashboardKeys.metricByRange(range),
        queryFn: () => fetchDashboardData(range),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    return {
        ...query,
        range,
        setRange
    };
}
