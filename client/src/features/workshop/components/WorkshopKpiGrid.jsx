import React from "react";

export function WorkshopKpiGrid({ metrics, isLoading, isError }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-pulse">
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
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {/* CHỜ */}
      <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
            CHỜ
          </span>
          <div className="bg-secondary/10 w-8 h-8 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary opacity-50 text-xl">
              schedule
            </span>
          </div>
        </div>
        <h3 className="text-3xl text-on-surface font-bold">
          {metrics.waiting || 0}
        </h3>
      </div>

      {/* CHẨN ĐOÁN */}
      <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-tertiary uppercase tracking-wider">
            CHẨN ĐOÁN
          </span>
          <div className="bg-tertiary/10 w-8 h-8 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-tertiary opacity-50 text-xl">
              troubleshoot
            </span>
          </div>
        </div>
        <h3 className="text-3xl text-on-surface font-bold">0</h3>
      </div>

      {/* ĐANG SỬA */}
      <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            ĐANG SỬA
          </span>
          <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary opacity-50 text-xl">
              handyman
            </span>
          </div>
        </div>
        <h3 className="text-3xl text-on-surface font-bold">
          {metrics.in_progress || 0}
        </h3>
      </div>

      {/* CHỜ T.TOÁN */}
      <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-warning uppercase tracking-wider">
            CHỜ T.TOÁN
          </span>
          <div className="bg-warning/10 w-8 h-8 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-warning opacity-50 text-xl">
              payments
            </span>
          </div>
        </div>
        <h3 className="text-3xl text-on-surface font-bold">0</h3>
      </div>

      {/* ĐÃ BÀN GIAO */}
      <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-success uppercase tracking-wider">
            ĐÃ BÀN GIAO
          </span>
          <div className="bg-success/10 w-8 h-8 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-success opacity-50 text-xl">
              task_alt
            </span>
          </div>
        </div>
        <h3 className="text-3xl text-on-surface font-bold">
          {metrics.completed || 0}
        </h3>
      </div>
    </div>
  );
}
