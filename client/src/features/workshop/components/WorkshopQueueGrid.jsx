import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getWorkshopRouteTarget } from "../workshop.interactions";

const BADGE_COLORS = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  success: "bg-success/10 text-success",
  error: "bg-error/10 text-error",
  warning: "bg-warning/10 text-warning",
};

export function WorkshopQueueGrid({ rows, isLoading, isFetching, isError, isEmpty }) {
  const navigate = useNavigate();

  if (isError) {
    return (
      <div className="text-center py-12 bg-error/10 text-error rounded-xl">
        <span className="material-symbols-outlined text-4xl mb-2">error</span>
        <p>Lỗi tải danh sách xe. Vui lòng thử lại.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-surface-container-highest animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${isFetching ? "opacity-60" : ""}`}>
      <button
        onClick={() => navigate(getWorkshopRouteTarget("create_intake"))}
        className="flex flex-col items-center justify-center h-full min-h-[200px] border-2 border-dashed border-outline-variant hover:border-primary hover:bg-primary/5 rounded-xl transition-colors text-on-surface-variant hover:text-primary group"
      >
        <span className="material-symbols-outlined text-4xl mb-2 group-hover:scale-110 transition-transform">
          add_circle
        </span>
        <span className="font-semibold">Tiếp nhận xe mới</span>
      </button>

      {isEmpty ? null : (
        rows?.map((row) => (
          <div
            key={row.id}
            className="bg-surface-container-high rounded-xl p-5 flex flex-col justify-between border border-outline-variant/30 hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-bold text-on-surface">
                  {row.licensePlate}
                </h4>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  BADGE_COLORS[row.status.badge] || "bg-surface-variant text-on-surface-variant"
                }`}
              >
                {row.status.label}
              </span>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm">
                <span className="material-symbols-outlined text-base mr-2 text-on-surface-variant">person</span>
                <span className="text-on-surface truncate">
                  <span className="text-on-surface-variant mr-1">Khách hàng:</span>
                  {row.customerName || "Chưa rõ"}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="material-symbols-outlined text-base mr-2 text-on-surface-variant">directions_car</span>
                <span className="text-on-surface truncate">
                  <span className="text-on-surface-variant mr-1">Hãng:</span>
                  {row.brand || "Chưa rõ"}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="material-symbols-outlined text-base mr-2 text-on-surface-variant">car_repair</span>
                <span className="text-on-surface truncate">
                  <span className="text-on-surface-variant mr-1">Mẫu xe:</span>
                  {row.model || "Chưa rõ"}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-auto">
              <div className="text-xs text-on-surface-variant flex items-center">
                <span className="material-symbols-outlined text-sm mr-1">schedule</span>
                {row.time}
              </div>
              <Link
                to={row.actions.view}
                className="px-4 py-2 bg-surface-container-highest hover:bg-primary hover:text-white text-primary text-sm font-semibold rounded-lg transition-colors"
              >
                Chi tiết
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
