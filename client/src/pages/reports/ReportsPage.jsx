import React from 'react';
import { useSearchParams, useNavigate, Navigate } from 'react-router-dom';
import InventoryReport from './InventoryReport';
import RepairReport from './RepairReport';
import RevenueReport from './RevenueReport';
import FinanceDebtReport from './FinanceDebtReport';

const TABS = [
  { id: 'revenue', label: 'Doanh thu', component: RevenueReport, icon: 'attach_money' },
  { id: 'repair', label: 'Sửa chữa', component: RepairReport, icon: 'build' },
  { id: 'inventory', label: 'Tồn kho', component: InventoryReport, icon: 'inventory_2' },
  { id: 'finance-debt', label: 'Công nợ', component: FinanceDebtReport, icon: 'account_balance_wallet' },
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
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Clean Header */}
      <div className="px-8 py-6 bg-white border-b border-slate-200 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Báo cáo & Thống kê</h1>
            <p className="text-sm text-slate-500 mt-1">Quản lý và phân tích số liệu hoạt động kinh doanh</p>
          </div>
        </div>
      </div>

      {/* Tab Rail */}
      <div className="px-8 bg-white border-b border-slate-200 shrink-0">
        <div className="max-w-7xl mx-auto">
          <nav className="-mb-px flex space-x-6 overflow-x-auto no-scrollbar">
            {TABS.map((t) => {
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleTabChange(t.id)}
                  className={`group inline-flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'}`}>
                    {t.icon}
                  </span>
                  {t.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Containerized Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[500px]">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
