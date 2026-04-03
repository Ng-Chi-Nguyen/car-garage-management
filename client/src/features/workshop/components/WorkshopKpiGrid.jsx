import React from "react";

export function WorkshopKpiGrid({ metrics, isLoading, isError }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-28 bg-surface-container-low rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-error/10 text-error p-4 rounded-xl text-center">
        Không thể tải dữ liệu KPI
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* CHỜ */}
      <div className="bg-surface-container-low p-5 rounded-xl border-none shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
            Chờ
          </span>
          <span className="material-symbols-outlined text-secondary opacity-50">
            schedule
          </span>
        </div>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl text-on-surface font-bold">
            {metrics.waiting || 0}
          </h3>
          <div className="text-xs text-secondary font-medium bg-secondary/10 px-2 py-1 rounded">Xe mới</div>
        </div>
      </div>

      {/* ĐANG SỬA */}
      <div className="bg-surface-container-low p-5 rounded-xl border-none shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Đang sửa
          </span>
          <span className="material-symbols-outlined text-primary opacity-50">
            handyman
          </span>
        </div>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl text-on-surface font-bold">
            {metrics.in_progress || 0}
          </h3>
          <div className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded">Cầu nâng</div>
        </div>
      </div>

      {/* HOÀN TẤT */}
      <div className="bg-surface-container-low p-5 rounded-xl border border-success/30 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-success uppercase tracking-wider">
            Hoàn tất
          </span>
          <span className="material-symbols-outlined text-success opacity-80" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl text-on-surface font-bold">
            {metrics.completed || 0}
          </h3>
          <div className="text-xs font-medium bg-success/10 text-success px-2 py-1 rounded">Hôm nay</div>
        </div>
      </div>
    </div>
  );
}
