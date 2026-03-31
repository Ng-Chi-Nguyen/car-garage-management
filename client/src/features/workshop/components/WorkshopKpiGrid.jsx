import React from "react";

export function WorkshopKpiGrid({ metrics, isLoading, isError }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-surface-container-low p-5 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
            Tiếp nhận
          </span>
          <span className="material-symbols-outlined text-secondary opacity-50">
            schedule
          </span>
        </div>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl text-on-surface font-bold">
            {metrics.waiting}
          </h3>
          <div className="text-xs text-secondary font-medium bg-secondary/10 px-2 py-1 rounded">
            Chờ
          </div>
        </div>
      </div>

      <div className="bg-surface-container-low p-5 rounded-xl">
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
            {metrics.in_progress}
          </h3>
          <div className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded">
            Thực hiện
          </div>
        </div>
      </div>

      <div className="bg-surface-container-low p-5 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-success uppercase tracking-wider">
            Hoàn tất
          </span>
          <span className="material-symbols-outlined text-success opacity-50">
            task_alt
          </span>
        </div>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl text-on-surface font-bold">
            {metrics.completed}
          </h3>
          <div className="text-xs text-success font-medium bg-success/10 px-2 py-1 rounded">
            Xong
          </div>
        </div>
      </div>

      <div className="bg-primary-container p-5 rounded-xl text-white shadow-lg shadow-primary-container/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-on-primary-container uppercase tracking-wider">
            Tổng cộng
          </span>
          <span
            className="material-symbols-outlined text-on-primary-container"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            view_list
          </span>
        </div>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl text-on-primary-container font-bold">
            {metrics.total}
          </h3>
          <div className="text-xs font-medium bg-white/20 text-on-primary-container px-2 py-1 rounded">
            Tất cả
          </div>
        </div>
      </div>
    </div>
  );
}
