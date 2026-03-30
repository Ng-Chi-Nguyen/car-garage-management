import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { fetchWorkshopData } from './workshop.api.js';
import { workshopKeys } from './workshop.queryKeys.js';
import {
    getValidRange,
    getValidStatus,
    getValidSearch,
    getValidPage,
    normalizeFilters,
    applyFilterUpdates,
    WORKSHOP_RANGE
} from './workshop.filters.js';

export function useWorkshopQuery() {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();

    const urlRange = searchParams.get('range');
    const urlStatus = searchParams.get('status');
    const urlSearch = searchParams.get('search');
    const urlPage = searchParams.get('page');
    
    const range = getValidRange(urlRange);
    const status = getValidStatus(urlStatus);
    const search = getValidSearch(urlSearch);
    const page = getValidPage(urlPage);

    // Filter URL normalization
    useEffect(() => {
        let needsNormalization = false;
        const normalized = normalizeFilters(searchParams);
        
        const currentKeys = Array.from(searchParams.keys());
        const normalizedKeys = Array.from(normalized.keys());
        
        if (currentKeys.length !== normalizedKeys.length) {
            needsNormalization = true;
        } else {
            for (const key of currentKeys) {
                if (searchParams.get(key) !== normalized.get(key)) {
                    needsNormalization = true;
                    break;
                }
            }
        }
            
        if (needsNormalization) {
            setSearchParams(normalized, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const filters = useMemo(() => ({ range, status, search, page }), [range, status, search, page]);

    // Bounded prefetch for adjacent range
    useEffect(() => {
        const ranges = Object.values(WORKSHOP_RANGE);
        const currentIndex = ranges.indexOf(range);

        if (currentIndex === -1) return;

        // Prefetch next and previous ranges if they exist
        const prefetchRange = ranges[currentIndex + 1] ?? ranges[currentIndex - 1];
        if (!prefetchRange) return;

        const prefetchFilters = { ...filters, range: prefetchRange, page: 1 };

        queryClient.prefetchQuery({
            queryKey: workshopKeys.data(prefetchFilters),
            queryFn: () => fetchWorkshopData(prefetchFilters),
            staleTime: 5 * 60 * 1000,
        });
    }, [range, filters, queryClient]);

    const updateFilters = (newFilters) => {
        setSearchParams(prev => applyFilterUpdates(prev, newFilters));
    };

    const query = useQuery({
        queryKey: workshopKeys.data(filters),
        queryFn: () => fetchWorkshopData(filters),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    return {
        ...query,
        filters,
        updateFilters,
    };
}
