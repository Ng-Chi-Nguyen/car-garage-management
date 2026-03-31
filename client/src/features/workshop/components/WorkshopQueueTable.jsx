import React from "react";
import { Link } from "react-router-dom";
import { getWorkshopRouteTarget } from "../workshop.interactions";

export function WorkshopQueueTable({
  rows,
  isLoading,
  isFetching,
  isError,
  isEmpty,
}) {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-surface-container-low rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-error bg-error/10 rounded-xl">
        Không thể tải danh sách xe
      </div>
    );
  }

  if (isEmpty || !rows || rows.length === 0) {
    return (
      <div className="p-12 text-center text-secondary bg-surface-container-low rounded-xl">
        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">
          inbox
        </span>
        <p>Không có dữ liệu</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col gap-3 relative transition-opacity duration-200 ${isFetching ? "opacity-60 pointer-events-none" : "opacity-100"}`}
    >
      {isFetching && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="bg-surface-container-high text-on-surface px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-medium text-sm">
            <span
              className="material-symbols-outlined animate-spin text-primary"
              style={{ animationDuration: "1.5s" }}
            >
              refresh
            </span>
            Đang tải...
          </div>
        </div>
      )}
      {rows.map((row) => (
        <div
          key={row.id}
          className="flex items-center justify-between bg-surface-container-lowest p-4 rounded-xl hover:bg-surface-container-low transition-colors"
        >
          <div className="flex items-center gap-6 flex-1">
            <div className="w-56">
              <h4 className="text-lg font-bold text-on-surface">
                {row.licensePlate}
              </h4>
              <div className="text-xs text-on-surface-variant flex flex-wrap items-center gap-1 mt-0.5">
                <span
                  className="font-mono bg-surface-container-high px-1 py-0.5 rounded text-[10px]"
                  title="Mã phiếu"
                >
                  #{row.id}
                </span>
                <span>•</span>
                <span title="Mã xe">{row.carId || "Không rõ mã"}</span>
                {row.brand && (
                  <>
                    <span>•</span>
                    <span title="Hãng xe">{row.brand}</span>
                  </>
                )}
              </div>
            </div>

            <div className="w-32">
              {row.status.badge === "primary" && (
                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-primary/10 text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  {row.status.label}
                </span>
              )}
              {row.status.badge === "secondary" && (
                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-secondary/10 text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  {row.status.label}
                </span>
              )}
              {row.status.badge === "tertiary" && (
                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-tertiary/10 text-tertiary">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                  {row.status.label}
                </span>
              )}
              {row.status.badge === "success" && (
                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-success/10 text-success">
                  <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                  {row.status.label}
                </span>
              )}
              {row.status.badge === "error" && (
                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-error/10 text-error">
                  <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                  {row.status.label}
                </span>
              )}
              {![
                "primary",
                "secondary",
                "tertiary",
                "success",
                "error",
              ].includes(row.status.badge) && (
                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-surface-container-high text-on-surface">
                  <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant"></span>
                  {row.status.label}
                </span>
              )}
            </div>

            <div className="flex-1 text-sm text-on-surface-variant">
              {row.time !== "-"
                ? new Date(row.time).toLocaleDateString("vi-VN")
                : "-"}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={getWorkshopRouteTarget("view_vehicle", { id: row.carId })}
              className="text-primary hover:text-primary-container font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors"
            >
              Chi tiết
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
