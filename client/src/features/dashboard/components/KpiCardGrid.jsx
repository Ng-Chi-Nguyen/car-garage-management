import React from 'react';
import { StatCard } from '../../../components/ui/stat-card';

export function KpiCardGrid({ kpis }) {
  if (!kpis) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div className="md:col-span-2 bg-white p-6 rounded-3xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center h-full">
          <p className="text-slate-500 text-sm font-medium mb-1">Tổng doanh thu</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-gray-900">
              {kpis.totalRevenue.toLocaleString('vi-VN')} <span className="text-2xl text-slate-500 font-medium">₫</span>
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl flex flex-col justify-between bg-slate-50/80">
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

      <div className="bg-white p-6 rounded-3xl flex flex-col justify-between bg-slate-50/80">
        <p className="text-slate-500 text-sm font-medium mb-1">Doanh thu TB/phiếu</p>
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-bold text-gray-900">
            {Math.round(kpis.avgRevenuePerRepairOrder || 0).toLocaleString('vi-VN')} <span className="text-base text-slate-500 font-medium">₫</span>
          </h3>
          <span className="material-symbols-outlined text-slate-400 ml-auto">payments</span>
        </div>
      </div>

      <div className="bg-blue-700 p-6 rounded-3xl flex flex-col justify-between text-white">
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
