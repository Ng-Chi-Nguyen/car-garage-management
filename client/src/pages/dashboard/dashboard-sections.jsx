import React from 'react';
import { StatCard } from '../../components/ui/stat-card';
import { SectionCard } from '../../components/ui/section-card';

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

export function MainMetricGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {/* Large Revenue Bento Card */}
      <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border-b-4 border-blue-600 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-slate-500 text-sm font-medium mb-1">Doanh thu hôm nay</p>
          <div className="flex items-baseline gap-2 mb-4">
            <h3 className="text-3xl font-bold text-gray-900">45.280.000 <span className="text-lg">₫</span></h3>
            <span className="flex items-center text-xs font-bold text-emerald-600">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              +12%
            </span>
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
      
      {/* Financial Metric Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between border border-gray-100">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">Công nợ hiện tại</p>
          <h3 className="text-2xl font-bold text-red-600">128.500.000 <span className="text-base font-medium">₫</span></h3>
        </div>
        <div className="pt-4 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Đã thu: 85%</span>
          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-[85%]"></div>
          </div>
        </div>
      </div>
      
      {/* Status Counter 1 */}
      <StatCard 
        label="Chờ tiếp nhận" 
        value="08" 
        icon={<span className="p-2 bg-blue-50 text-blue-700 rounded-lg material-symbols-outlined">schedule</span>} 
      />

      {/* Status Counter 2 */}
      <StatCard 
        label="Đang sửa" 
        value="15" 
        icon={<span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg material-symbols-outlined">build</span>} 
      />

      {/* Status Counter 3 */}
      <StatCard 
        label="Hoàn thành ngày" 
        value="22" 
        icon={<span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg material-symbols-outlined">check_circle</span>} 
      />

      {/* KPI Card */}
      <div className="bg-blue-700 p-6 rounded-xl shadow-sm flex flex-col justify-between text-white">
        <p className="text-white/80 text-sm font-medium mb-1">KPI Tháng</p>
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-bold">92%</h3>
          <span className="material-symbols-outlined text-white/50">moving</span>
        </div>
        <div className="mt-2 text-[10px] bg-white/20 p-1 px-2 rounded-full w-fit">Vượt mục tiêu +5%</div>
      </div>
    </div>
  );
}

export function SecondaryGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* New Vehicles Table */}
      <SectionCard title="Danh sách xe mới tiếp nhận" className="lg:col-span-2" action={<button className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-full transition-colors">Xem tất cả</button>}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-100">
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Biển số</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hiệu xe</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chủ xe</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <tr>
                <td className="py-3 text-sm font-bold text-slate-900">51H-123.45</td>
                <td className="py-3 text-sm text-slate-500">Toyota Camry</td>
                <td className="py-3 text-sm text-slate-700">Nguyễn Văn A</td>
                <td className="py-3 text-sm text-slate-500 text-right">10:30</td>
              </tr>
              <tr>
                <td className="py-3 text-sm font-bold text-slate-900">29A-678.90</td>
                <td className="py-3 text-sm text-slate-500">Honda Civic</td>
                <td className="py-3 text-sm text-slate-700">Trần Thị B</td>
                <td className="py-3 text-sm text-slate-500 text-right">09:15</td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Activity Log Placeholder */}
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
