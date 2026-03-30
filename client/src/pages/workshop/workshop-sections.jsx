import React from 'react';
import { WorkshopKpiGrid } from '../../features/workshop/components/WorkshopKpiGrid';
import { WorkshopStatusPanel } from '../../features/workshop/components/WorkshopStatusPanel';

export function WorkshopKpiSection({ data, isLoading, isError }) {
    return (
        <section className="mb-6">
            <WorkshopKpiGrid 
                metrics={data?.metrics} 
                isLoading={isLoading} 
                isError={isError} 
            />
        </section>
    );
}

export function WorkshopQueueSection({ data, isLoading, isError, filters, updateFilters }) {
    return (
        <section>
            <WorkshopStatusPanel 
                data={data}
                isLoading={isLoading}
                isError={isError}
                filters={filters}
                updateFilters={updateFilters}
            />
        </section>
    );
}
