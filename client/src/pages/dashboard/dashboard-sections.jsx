import React from "react";
import { KpiCardGrid } from "../../features/dashboard/components/KpiCardGrid";
import { RecentRepairOrdersTable } from "../../features/dashboard/components/RecentRepairOrdersTable";
import { DashboardQuickActions } from "../../features/dashboard/components/DashboardQuickActions";
import { DashboardTrendChart } from "../../features/dashboard/components/DashboardTrendChart";

export function MainMetricGrid({ kpis }) {
  return <KpiCardGrid kpis={kpis} />;
}

export function SecondaryGrid({ recentOrders, trendSeries }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <RecentRepairOrdersTable
        orders={recentOrders}
      />

      <div className="space-y-8">
        <DashboardTrendChart trendSeries={trendSeries} />
        <DashboardQuickActions />
      </div>
    </div>
  );
}
