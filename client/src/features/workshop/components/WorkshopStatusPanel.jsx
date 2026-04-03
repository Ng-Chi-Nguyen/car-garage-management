import React, { useState, useEffect } from "react";
import { WorkshopQueueGrid } from "./WorkshopQueueGrid";

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả", metricKey: "total" },
  { value: "waiting", label: "Tiếp nhận", metricKey: "waiting" },
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

  return (
    <div className="bg-surface-container-low rounded-[24px] p-6">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-on-surface">
            Danh sách xe trong xưởng
          </h3>

          <div className="flex gap-2">
            {STATUS_OPTIONS.map((opt) => {
              const isActive = currentStatus === opt.value;
              const count = metrics[opt.metricKey] ?? 0;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => updateFilters({ status: opt.value, page: 1 })}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors border-none ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                  }`}
                >
                  {opt.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center justify-between bg-surface-container-high p-4 rounded-xl">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 items-center flex-1 max-w-md">
            <input
              type="text"
              value={draftSearch}
              onChange={(e) => setDraftSearch(e.target.value)}
              placeholder="Tìm kiếm..."
              className="flex-1 px-4 py-2 rounded-lg border border-outline bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button 
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white transition-colors hover:bg-primary-container hover:text-on-primary-container border-none"
            >
              Tìm
            </button>
          </form>
          
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-primary transition-colors hover:bg-surface-container-highest border-none ml-4"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      <WorkshopQueueGrid
        rows={data?.activeRows}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        isEmpty={!data?.activeRows?.length}
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
