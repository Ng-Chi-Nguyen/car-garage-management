import React from "react";

export function WorkshopPerformancePanel({ metrics }) {
  if (!metrics) return null;

  const inProgress = metrics.in_progress || 0;
  const completed = metrics.completed || 0;
  const total = metrics.total || 1; // Avoid div by zero

  const completionRate = Math.round((completed / total) * 100);
  const activeRate = Math.round((inProgress / total) * 100);
  const todayCount = metrics.total || 0;

  return (
    <div className="bg-surface-container-low p-6 rounded-2xl mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-on-surface">Hiệu suất xưởng</h3>
        <span className="text-sm text-on-surface-variant">Cập nhật: Mới nhất</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-secondary uppercase tracking-widest">Tỷ lệ hoàn thành</p>
          <p className="text-2xl font-bold">{completionRate}%</p>
          <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-secondary uppercase tracking-widest">Xe đang xử lý</p>
          <p className="text-2xl font-bold">{activeRate}%</p>
          <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${activeRate}%` }}></div>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-secondary uppercase tracking-widest">Số lệnh trong ngày</p>
          <p className="text-2xl font-bold">{todayCount}</p>
          <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: '45%' }}></div>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-secondary uppercase tracking-widest">Đã giao</p>
          <p className="text-2xl font-bold">{completed}</p>
          <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: '90%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
