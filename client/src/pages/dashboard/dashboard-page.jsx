import React from "react";
import { MainMetricGrid, SecondaryGrid } from "./dashboard-sections";
import { PageHeader } from "../../components/ui/page-header";
import { useDashboardQuery } from "../../features/dashboard/useDashboardQuery";
import { DASHBOARD_RANGES } from "../../features/dashboard/dashboard.constants";
import { LoadingState } from "../../components/ui/state-shell/loading-state";
import { ErrorState } from "../../components/ui/state-shell/error-state";
import { StateShell } from "../../components/ui/state-shell/state-shell";

export default function DashboardPage() {
  const { data, range, setRange, isLoading, isError } = useDashboardQuery();

  const getButtonClass = (isActive) =>
    isActive
      ? "px-4 py-1.5 text-sm font-semibold text-[color:var(--color-primary)] bg-[color:var(--color-surface)] rounded-md shadow-sm"
      : "px-4 py-1.5 text-sm font-medium text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]";

  const filterActions = (
    <div className="flex bg-[color:var(--color-surface-dim)] p-1 rounded-lg">
      <button
        className={getButtonClass(range === DASHBOARD_RANGES.THIS_MONTH)}
        onClick={() => setRange(DASHBOARD_RANGES.THIS_MONTH)}
      >
        Tháng này
      </button>
      <button
        className={getButtonClass(range === DASHBOARD_RANGES.LAST_7_DAYS)}
        onClick={() => setRange(DASHBOARD_RANGES.LAST_7_DAYS)}
      >
        7 ngày
      </button>
      <button
        className={getButtonClass(range === DASHBOARD_RANGES.LAST_30_DAYS)}
        onClick={() => setRange(DASHBOARD_RANGES.LAST_30_DAYS)}
      >
        30 ngày
      </button>
      <button
        className={getButtonClass(range === DASHBOARD_RANGES.LAST_90_DAYS)}
        onClick={() => setRange(DASHBOARD_RANGES.LAST_90_DAYS)}
      >
        90 ngày
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Tổng quan"
        description="Tổng quan hoạt động của Gara"
        actions={filterActions}
      />
      <StateShell 
        isLoading={isLoading} 
        isError={isError} 
        loadingFallback={<LoadingState message="Đang tải dữ liệu dashboard..." />}
        errorFallback={<ErrorState message="Lỗi tải dữ liệu dashboard" />}
      >
        <MainMetricGrid
          kpis={data?.kpis}
        />
        <SecondaryGrid
          recentOrders={data?.recentOrders}
          trendSeries={data?.trendSeries}
        />
      </StateShell>
    </div>
  );
}
