import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getWorkshopRouteTarget } from "../workshop.interactions";

const BADGE_COLORS = {
  primary: { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary", border: "border-primary", labelBg: "bg-primary" },
  secondary: { bg: "bg-secondary/10", text: "text-secondary", dot: "bg-secondary", border: "border-secondary", labelBg: "bg-secondary" },
  success: { bg: "bg-success/10", text: "text-success", dot: "bg-success", border: "border-success", labelBg: "bg-success" },
  error: { bg: "bg-error/10", text: "text-error", dot: "bg-error", border: "border-error", labelBg: "bg-error" },
  warning: { bg: "bg-warning/10", text: "text-warning", dot: "bg-warning", border: "border-warning", labelBg: "bg-warning" },
};

const BORDER_COLORS = {
  primary: "border-primary",
  secondary: "border-secondary",
  success: "border-emerald-500",
  error: "border-error",
  warning: "border-warning",
};

export function WorkshopQueueGrid({ rows, isLoading, isFetching, isError, isEmpty, onRetry, onResetFilters, hasActiveFilters }) {
  const navigate = useNavigate();

  const formatWorkshopTime = (rawTime) => {
    if (!rawTime || rawTime === "-") return "-";
    const parsed = new Date(rawTime);
    if (Number.isNaN(parsed.getTime())) return rawTime;
    return parsed.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isError) {
    return (
      <div className="text-center py-12 bg-error/10 text-error rounded-xl flex flex-col items-center">
        <span className="material-symbols-outlined text-4xl mb-2">error</span>
        <p className="mb-4">Lỗi tải danh sách xe. Vui lòng thử lại.</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-error text-white font-semibold rounded-lg hover:bg-error/90 transition-colors"
          >
            Thử lại
          </button>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[220px] bg-surface-container-highest animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isFetching ? "opacity-60" : ""}`}>
      {isEmpty ? (
        <div className="md:col-span-1 lg:col-span-2 flex flex-col items-center justify-center text-center p-6 bg-surface-container-low rounded-xl border border-dashed border-outline-variant min-h-[220px]">
          <span className="material-symbols-outlined text-4xl mb-2 text-on-surface-variant">search_off</span>
          <p className="text-on-surface-variant mb-4">Không tìm thấy xe nào phù hợp với bộ lọc.</p>
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      ) : (
        rows?.map((row) => {
          const colors = BADGE_COLORS[row.status.badge] || {
            bg: "bg-surface-variant",
            text: "text-on-surface-variant",
            dot: "bg-on-surface-variant",
          };
          
          const borderStyle = `border-l-4 border-y border-r border-y-slate-200 border-r-slate-200 ${BORDER_COLORS[row.status.badge] || "border-outline-variant"}`;

          return (
            <div
              key={row.id}
              className={`bg-surface-container-lowest p-6 rounded-2xl group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${borderStyle}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-2xl font-black text-on-surface tracking-tight">
                    {row.licensePlate}
                  </h4>
                  <p className="text-sm font-medium text-on-surface-variant mt-1">
                    {row.brand} {row.model}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-on-surface-variant">Khách hàng:</span>
                  <span className="font-semibold">{row.customerName || "Chưa rõ"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-on-surface-variant">Nhân viên tiếp nhận:</span>
                  <span className="font-semibold">{row.intakeStaffName || "Chưa phân công"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-on-surface-variant">Tiếp nhận:</span>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base opacity-70">schedule</span>
                    <span className="font-semibold">{formatWorkshopTime(row.time)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} ${row.status.badge === 'primary' ? 'animate-pulse' : ''}`}></span>
                  {row.status.label}
                </span>
                <Link
                  to={row.actions.view}
                  className="text-primary-container font-bold text-xs hover:text-primary transition-colors uppercase tracking-wider flex items-center gap-1"
                >
                  Chi tiết <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          );
        })
      )}
      
      <button
        onClick={() => navigate(getWorkshopRouteTarget("create_intake"))}
        className="bg-surface-container-lowest p-6 rounded-xl group border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-colors cursor-pointer min-h-[220px]"
      >
        <span className="material-symbols-outlined text-4xl mb-2 group-hover:scale-110 transition-transform">
          add_circle
        </span>
        <span className="font-bold text-sm">Tiếp nhận xe mới</span>
      </button>
    </div>
  );
}
