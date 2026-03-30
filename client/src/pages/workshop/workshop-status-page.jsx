import React from 'react';
import { PageHeader } from '../../components/ui/page-header';
import { useWorkshopQuery } from '../../features/workshop/useWorkshopQuery';
import { WorkshopKpiSection, WorkshopQueueSection } from './workshop-sections';

export default function WorkshopStatusPage() {
    const { data, isLoading, isError, filters, updateFilters } = useWorkshopQuery();

    return (
        <div className="space-y-8">
            <PageHeader 
                title="Trạng thái Xưởng" 
                description="Quản lý và theo dõi tiến độ sửa chữa xe trong xưởng"
            />

            <WorkshopKpiSection 
                data={data} 
                isLoading={isLoading} 
                isError={isError} 
            />

            <WorkshopQueueSection 
                data={data} 
                isLoading={isLoading} 
                isError={isError}
                filters={filters}
                updateFilters={updateFilters}
            />
        </div>
    );
}
