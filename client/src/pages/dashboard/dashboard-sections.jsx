import React from 'react';
import { SectionCard } from '../../components/ui/section-card';
import { KpiCardGrid } from '../../features/dashboard/components/KpiCardGrid';
import { RecentRepairOrdersTable } from '../../features/dashboard/components/RecentRepairOrdersTable';

export function WarningRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-100 rounded-xl">
        <div className="w-10 h-10 flex items-center justify-center bg-red-600 rounded-full text-white">
          <span className="material-symbols-outlined">warning</span>
        </div>
        <div>
          <p className="text-sm font-bold text-red-900">Vượt số xe tối đa trong ngày</p>
          <p className="text-xs text-red-800">Hiện tại 25/20 xe. Vui lòng kiểm tra lại công suất tiếp nhận.</p>
        </div>
      </div>
      <div className="flex items-center gap-4 p-4 bg-orange-50 border border-orange-100 rounded-xl">
        <div className="w-10 h-10 flex items-center justify-center bg-orange-500 rounded-full text-white">
          <span className="material-symbols-outlined">inventory_2</span>
        </div>
        <div>
          <p className="text-sm font-bold text-orange-900">Vật tư tồn kho thấp</p>
          <p className="text-xs text-orange-800">Có 12 mặt hàng dầu nhớt và phụ tùng dưới mức an toàn.</p>
        </div>
      </div>
    </div>
  );
}

export function MainMetricGrid({ kpis, isLoading, isError }) {
  if (isLoading) {
    return <div className="p-8 text-center text-slate-500 bg-white rounded-xl shadow-sm">Đang tải dữ liệu tổng quan...</div>;
  }
  if (isError) {
    return <div className="p-8 text-center text-red-500 bg-white rounded-xl shadow-sm">Lỗi khi tải dữ liệu tổng quan.</div>;
  }
  if (!kpis) return null;

  return <KpiCardGrid kpis={kpis} />;
}

export function SecondaryGrid({ recentOrders, isLoading, isError }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <RecentRepairOrdersTable orders={recentOrders} isLoading={isLoading} isError={isError} />

      <SectionCard title="Hoạt động gần đây">
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500"></div>
            <div>
              <p className="text-sm font-medium text-slate-900">Tiếp nhận xe 51H-123.45</p>
              <p className="text-xs text-slate-500">10:30 - Lễ tân</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500"></div>
            <div>
              <p className="text-sm font-medium text-slate-900">Hoàn thành sửa chữa 30E-444.55</p>
              <p className="text-xs text-slate-500">09:45 - KTV Hùng</p>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
