import React, { useState, useEffect } from "react";
import { WorkshopQueueGrid } from "./WorkshopQueueGrid";

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả", metricKey: "total" },
  { value: "waiting", label: "Chờ", metricKey: "waiting" },
  { value: "in_progress", label: "Đang sửa", metricKey: "in_progress" },
  { value: "completed", label: "Hoàn tất", metricKey: "completed" },
];

export function WorkshopStatusPanel({
  data,
  isLoading,
  isFetching,
  isError,
  filters,
  updateFilters,
  onRetry,
}) {
  const currentStatus = filters?.status || "all";
  const currentPage = Number(filters?.page) || 1;
  const currentSearch = filters?.search || "";

  const { totalPages = 1, totalItems = 0 } = data?.pagination || {};
  const metrics = data?.metrics || {};

  const [draftSearch, setDraftSearch] = useState(currentSearch);

  useEffect(() => {
    setDraftSearch(currentSearch);
  }, [currentSearch]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateFilters({ page: newPage });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ search: draftSearch, page: 1 });
  };

  const handleReset = () => {
    updateFilters({ status: "all", range: "7d", search: "", page: 1 });
  };

  const hasActiveFilters = currentStatus !== "all" || filters?.range !== "7d" || currentSearch !== "";

  return (
    <div className="bg-surface-container-low rounded-[24px] p-6 shadow-sm">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl font-black text-on-surface tracking-tight">
            Danh sách xe trong xưởng
          </h3>

          <div className="flex bg-surface-container-high p-1 rounded-xl">
            {STATUS_OPTIONS.map((opt) => {
              const isActive = currentStatus === opt.value;
              const count = metrics[opt.metricKey] ?? 0;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => updateFilters({ status: opt.value, page: 1 })}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all border-none ${
                    isActive
                      ? "bg-surface shadow-sm text-primary"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {opt.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-primary/10' : 'bg-surface-container-highest'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 items-center w-full max-w-md relative">
            <span className="material-symbols-outlined absolute left-4 text-on-surface-variant">search</span>
            <input
              type="text"
              value={draftSearch}
              onChange={(e) => setDraftSearch(e.target.value)}
              placeholder="Tìm theo biển số, khách hàng..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border-none bg-surface-container-high text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
          </form>
          
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-error transition-colors hover:bg-error/10 border-none ml-4 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">filter_alt_off</span> Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      <WorkshopQueueGrid
        rows={data?.activeRows}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        isEmpty={!data?.activeRows?.length}
        onRetry={onRetry}
        onResetFilters={handleReset}
        hasActiveFilters={hasActiveFilters}
      />

      {!isLoading && !isError && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-2">
          <div className="text-sm text-on-surface-variant">
            Hiển thị trang {currentPage} / {totalPages} ({totalItems} kết quả)
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isFetching}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors border-none bg-surface-container-high text-on-surface hover:bg-surface-container-highest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isFetching}
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
