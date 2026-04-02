import React from 'react';
import { useSearchParams, useNavigate, Navigate } from 'react-router-dom';
import InventoryReport from './InventoryReport';
import RepairReport from './RepairReport';
import RevenueReport from './RevenueReport';
import FinanceDebtReport from './FinanceDebtReport';

const TABS = [
  { id: 'revenue', label: 'Báo cáo doanh thu', component: RevenueReport },
  { id: 'repair', label: 'Báo cáo sửa chữa', component: RepairReport },
  { id: 'inventory', label: 'Báo cáo tồn kho', component: InventoryReport },
  { id: 'finance-debt', label: 'Báo cáo công nợ', component: FinanceDebtReport },
];

export default function ReportsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tab = searchParams.get('tab') || 'revenue';

  const activeTab = TABS.find((t) => t.id === tab);

  if (!activeTab) {
    return <Navigate to="/reports?tab=revenue" replace />;
  }

  const ActiveComponent = activeTab.component;

  const handleTabChange = (tabId) => {
    navigate(`/reports?tab=${tabId}`);
  };

  return (
    <div className="p-6 h-full flex flex-col bg-slate-50">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                  tab === t.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
