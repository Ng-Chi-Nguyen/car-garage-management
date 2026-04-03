import React from "react";
import { StatCard } from "../../../components/ui/stat-card";
import { useActivityStatsQuery } from "../useActivityQuery";
import { StateShell } from "../../../components/ui/state-shell";

export function ActivityStats({ filters }) {
  const query = useActivityStatsQuery(filters);

  return (
    <StateShell
      query={query}
      loadingComponent={<div className="h-48 bg-surface-container-low rounded-xl animate-pulse" />}
    >
      {({ data }) => (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4 bg-primary text-white p-6 rounded-xl relative overflow-hidden flex flex-col justify-between h-48 shadow-xl shadow-primary/10">
            <div className="relative z-10">
              <p className="text-sm font-medium opacity-80 uppercase tracking-widest">
                Tổng thao tác hôm nay
              </p>
              <h3 className="text-5xl font-bold mt-2 font-headline">
                {Number(data.totalActions ?? 0).toLocaleString("vi-VN")}
              </h3>
            </div>
            <div className="relative z-10 flex items-center gap-2 text-sm text-primary-fixed">
              <span className="material-symbols-outlined text-sm">
                trending_up
              </span>
              <span>{data.trend ?? "+0.0%"} so với hôm qua</span>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <span
                className="material-symbols-outlined text-[140px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                analytics
              </span>
            </div>
          </div>

          <div className="col-span-6 lg:col-span-4">
            <StatCard
              title="Người dùng tích cực"
               value={String(data.activeUsers ?? 0)}
              icon="person"
              description="nhân viên"
            />
          </div>

          <div className="col-span-6 lg:col-span-4">
            <StatCard
              title="Lỗi phát sinh"
               value={String(data.errors ?? 0).padStart(2, "0")}
              icon="warning"
               description={`thất bại (Tỷ lệ thành công ${data.successRate ?? "0%"})`}
              valueColor="text-error"
            />
          </div>
        </div>
      )}
    </StateShell>
  );
}
