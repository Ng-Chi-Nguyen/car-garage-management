import React from 'react';
import { WarningRow, MainMetricGrid, SecondaryGrid } from './dashboard-sections';
import { PageHeader } from '../../components/ui/page-header';
import { useDashboardQuery } from '../../features/dashboard/useDashboardQuery';
import { DASHBOARD_RANGES } from '../../features/dashboard/dashboard.constants';

export default function DashboardPage() {
  const { data, range, setRange, isLoading, isError } = useDashboardQuery();

  const getButtonClass = (isActive) => 
    isActive 
      ? "px-4 py-1.5 text-sm font-semibold text-blue-600 bg-white rounded-md shadow-sm"
      : "px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700";

  const filterActions = (
    <div className="flex bg-gray-100 p-1 rounded-lg">
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
        7 ngày qua
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
      <WarningRow />
      <MainMetricGrid kpis={data?.kpis} isLoading={isLoading} isError={isError} />
      <SecondaryGrid recentOrders={data?.recentOrders} isLoading={isLoading} isError={isError} />
    </div>
  );
}
