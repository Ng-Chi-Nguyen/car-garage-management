import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DASHBOARD_QUICK_ACTIONS } from '../dashboard.quickActions.js';
import { handleQuickActionClick } from '../dashboard.interactions.js';
import { SectionCard } from '../../../components/ui/section-card';

export function DashboardQuickActions() {
  const navigate = useNavigate();

  return (
    <SectionCard title="Thao tác nhanh">
      <div className="grid grid-cols-2 gap-4">
        {DASHBOARD_QUICK_ACTIONS.map((action, index) => (
          <button
            key={index}
            onClick={() => handleQuickActionClick(navigate, action.path)}
            className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors border border-gray-100 hover:border-blue-100"
          >
            <span className="material-symbols-outlined text-blue-600 mb-2">{action.icon}</span>
            <span className="text-sm font-medium text-gray-700">{action.label}</span>
          </button>
        ))}
      </div>
    </SectionCard>
  );
}
