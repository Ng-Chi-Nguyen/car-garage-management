import React from "react";

export function WorkshopPerformancePanel({ metrics }) {
  if (!metrics) return null;

  const inProgress = metrics.in_progress || 0;
  const completed = metrics.completed || 0;
  const total = metrics.total || 1; // Avoid div by zero

  const completionRate = Math.round((completed / total) * 100);
  const activeRate = Math.round((inProgress / total) * 100);

  return (
    <div className="bg-surface-container-low rounded-[24px] p-6 mt-8">
      <h3 className="text-lg font-bold text-on-surface mb-6">
        Hiệu suất xưởng
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center p-4 bg-surface-container-highest rounded-xl">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4">
            <span className="material-symbols-outlined">speed</span>
          </div>
          <div>
            <p className="text-sm text-on-surface-variant">Tỷ lệ hoàn thành</p>
            <p className="text-2xl font-bold text-on-surface">{completionRate}%</p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-surface-container-highest rounded-xl">
          <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mr-4">
            <span className="material-symbols-outlined">monitoring</span>
          </div>
          <div>
            <p className="text-sm text-on-surface-variant">Xe đang xử lý</p>
            <p className="text-2xl font-bold text-on-surface">{activeRate}%</p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-surface-container-highest rounded-xl">
          <div className="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center mr-4">
            <span className="material-symbols-outlined">assignment_turned_in</span>
          </div>
          <div>
            <p className="text-sm text-on-surface-variant">Đã giao trong ngày</p>
            <p className="text-2xl font-bold text-on-surface">{completed}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
