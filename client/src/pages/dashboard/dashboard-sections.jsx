import React from "react";
import { KpiCardGrid } from "../../features/dashboard/components/KpiCardGrid";
import { RecentRepairOrdersTable } from "../../features/dashboard/components/RecentRepairOrdersTable";
import { DashboardQuickActions } from "../../features/dashboard/components/DashboardQuickActions";
import { DashboardTrendChart } from "../../features/dashboard/components/DashboardTrendChart";

export function MainMetricGrid({ kpis, isLoading, isError }) {
  if (isError) {
    return (
      <div className="p-8 text-center text-red-500 bg-white rounded-xl shadow-sm">
        Lỗi khi tải dữ liệu tổng quan.
      </div>
    );
  }
  return <KpiCardGrid kpis={kpis} isLoading={isLoading} />;
}

export function SecondaryGrid({
  recentOrders,
  trendSeries,
  isLoading,
  isError,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <RecentRepairOrdersTable
        orders={recentOrders}
        isLoading={isLoading}
        isError={isError}
      />

      <div className="space-y-8">
        <DashboardTrendChart trendSeries={trendSeries} isLoading={isLoading} />
        <DashboardQuickActions />
      </div>
    </div>
  );
}
