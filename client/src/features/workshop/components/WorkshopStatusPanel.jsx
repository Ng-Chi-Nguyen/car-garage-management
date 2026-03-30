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
    
    const { page = 1, totalPages = 1, totalItems = 0 } = data?.pagination || {};
    
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            updateFilters({ page: newPage });
        }
    };

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

            {!isLoading && !isError && totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-2">
                    <div className="text-sm text-on-surface-variant">
                        Hiển thị trang {page} / {totalPages} ({totalItems} kết quả)
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page <= 1}
                            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors border-none bg-surface-container-high text-on-surface hover:bg-surface-container-highest disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Trước
                        </button>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= totalPages}
                            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors border-none bg-surface-container-high text-on-surface hover:bg-surface-container-highest disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
