import React from 'react';
import { WorkshopQueueTable } from './WorkshopQueueTable';

const STATUS_OPTIONS = [
    { value: 'all', label: 'Tất cả' },
    { value: 'waiting', label: 'Tiếp nhận' },
    { value: 'in_progress', label: 'Đang sửa' },
    { value: 'completed', label: 'Hoàn tất' }
];

export function WorkshopStatusPanel({ data, isLoading, isError, filters, updateFilters }) {
    const currentStatus = filters?.status || 'all';

    return (
        <div className="bg-surface-container-low rounded-[24px] p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-on-surface">Danh sách xe trong xưởng</h3>
                
                <div className="flex gap-2">
                    {STATUS_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => updateFilters({ status: opt.value })}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors border-none ${
                                currentStatus === opt.value 
                                    ? 'bg-primary text-white' 
                                    : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            <WorkshopQueueTable 
                rows={data?.activeRows} 
                isLoading={isLoading} 
                isError={isError} 
                isEmpty={!data?.activeRows?.length}
            />
        </div>
    );
}
