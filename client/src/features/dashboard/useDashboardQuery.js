import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchDashboardData } from './dashboard.api.js';
import { dashboardKeys } from './dashboard.queryKeys.js';
import { getValidRange } from './dashboard.dateRange.js';
import { DASHBOARD_RANGES } from './dashboard.constants.js';

export function useDashboardQuery() {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();
    
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

    // Prefetch one adjacent range only to avoid request bursts
    useEffect(() => {
        const ranges = Object.values(DASHBOARD_RANGES);
        const currentIndex = ranges.indexOf(range);

        if (currentIndex === -1) return;

        const prefetchRange = ranges[currentIndex + 1] ?? ranges[currentIndex - 1];
        if (!prefetchRange) return;

        queryClient.prefetchQuery({
            queryKey: dashboardKeys.metricByRange(prefetchRange),
            queryFn: () => fetchDashboardData(prefetchRange),
            staleTime: 5 * 60 * 1000, // 5 minutes
        });
    }, [range, queryClient]);

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
        // Cache strategy: keep previous UI while switching range to avoid flicker
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 15 * 60 * 1000, // keep cache in memory for smooth range back-and-forth
        refetchOnWindowFocus: false,
    });

    return {
        ...query,
        range,
        setRange
    };
}
