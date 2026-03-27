import React from 'react';
import { StatCard } from '../../../components/ui/stat-card';

export function KpiCardGrid({ kpis }) {
  if (!kpis) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border-b-4 border-blue-600 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-slate-500 text-sm font-medium mb-1">Doanh thu</p>
          <div className="flex items-baseline gap-2 mb-4">
            <h3 className="text-3xl font-bold text-gray-900">
              {kpis.totalRevenue.toLocaleString('vi-VN')} <span className="text-lg">₫</span>
            </h3>
          </div>
          <div className="h-16 w-full flex items-end gap-1">
            <div className="flex-1 bg-blue-100 h-[40%] rounded-t-sm"></div>
            <div className="flex-1 bg-blue-100 h-[60%] rounded-t-sm"></div>
            <div className="flex-1 bg-blue-100 h-[35%] rounded-t-sm"></div>
            <div className="flex-1 bg-blue-200 h-[70%] rounded-t-sm"></div>
            <div className="flex-1 bg-blue-100 h-[50%] rounded-t-sm"></div>
            <div className="flex-1 bg-blue-600 h-[90%] rounded-t-sm"></div>
            <div className="flex-1 bg-blue-300 h-[65%] rounded-t-sm"></div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between border border-gray-100">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">Tổng xe & khách</p>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Khách hàng</span>
              <span className="font-bold text-slate-900">{kpis.totalCustomers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Xe</span>
              <span className="font-bold text-slate-900">{kpis.totalVehicles}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Tổng phiếu sửa</span>
              <span className="font-bold text-slate-900">{kpis.totalRepairOrders}</span>
            </div>
          </div>
        </div>
      </div>

      <StatCard 
        label="Chờ tiếp nhận" 
        value={String(kpis.waitingCount).padStart(2, '0')} 
        icon={<span className="p-2 bg-blue-50 text-blue-700 rounded-lg material-symbols-outlined">schedule</span>} 
      />

      <StatCard 
        label="Đang sửa" 
        value={String(kpis.repairingCount).padStart(2, '0')} 
        icon={<span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg material-symbols-outlined">build</span>} 
      />

      <StatCard 
        label="Hoàn thành" 
        value={String(kpis.completedCount).padStart(2, '0')} 
        icon={<span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg material-symbols-outlined">check_circle</span>} 
      />

      <div className="bg-blue-700 p-6 rounded-xl shadow-sm flex flex-col justify-between text-white">
        <p className="text-white/80 text-sm font-medium mb-1">Tỷ lệ hoàn thành</p>
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-bold">
            {kpis.totalRepairOrders > 0 
              ? Math.round((kpis.completedCount / kpis.totalRepairOrders) * 100) 
              : 0}%
          </h3>
          <span className="material-symbols-outlined text-white/50">moving</span>
        </div>
      </div>
    </div>
  );
}
