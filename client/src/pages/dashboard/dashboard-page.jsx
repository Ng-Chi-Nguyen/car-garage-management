import React from 'react';
import { WarningRow, MainMetricGrid, SecondaryGrid } from './dashboard-sections';
import { PageHeader } from '../../components/ui/page-header';

export default function DashboardPage() {
  const filterActions = (
    <div className="flex bg-slate-100/50 p-1 rounded-lg">
      <button className="px-4 py-1.5 text-sm font-semibold text-blue-600 bg-white rounded-md shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">Tháng này</button>
      <button className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700">7 ngày qua</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard Tổng quan" 
        description="Hôm nay, 24 Tháng 5, 2024"
        actions={filterActions}
      />
      <WarningRow />
      <MainMetricGrid />
      <SecondaryGrid />
    </div>
  );
}
