import React from 'react';
import { PageHeader } from '../../components/ui/page-header';
import { StatCard } from '../../components/ui/stat-card';
import { DataTable } from '../../components/ui/data-table';
import { SectionCard } from '../../components/ui/section-card';
import { StatusBadge } from '../../components/ui/status-badge';

export default function ActivityLogPage() {
  const tableHeaders = [
    'Thời gian',
    'Người thực hiện',
    'Vai trò',
    'Loại thao tác',
    'Nội dung chi tiết',
    'Trạng thái'
  ];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Nhật ký thao tác" 
        description="Giám sát và kiểm tra toàn bộ hoạt động hệ thống Gara."
        actions={
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest text-on-surface-variant font-medium rounded-lg hover:bg-slate-50 transition-all">
              <span className="material-symbols-outlined text-lg">file_download</span>
              Xuất báo cáo (Excel)
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-container transition-all">
              <span className="material-symbols-outlined text-lg">refresh</span>
              Làm mới dữ liệu
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 bg-primary text-white p-6 rounded-xl relative overflow-hidden flex flex-col justify-between h-48">
          <div className="relative z-10">
            <p className="text-sm font-medium opacity-80 uppercase tracking-widest">Tổng thao tác hôm nay</p>
            <h3 className="text-5xl font-bold mt-2 font-headline">1,284</h3>
          </div>
          <div className="relative z-10 flex items-center gap-2 text-sm text-primary-fixed">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+12.5% so với hôm qua</span>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <span className="material-symbols-outlined text-[140px]" style={{fontVariationSettings: "'FILL' 1"}}>analytics</span>
          </div>
        </div>

        <div className="col-span-6 lg:col-span-4">
          <StatCard 
            title="Người dùng tích cực" 
            value="12" 
            icon="person"
            description="nhân viên"
          />
        </div>

        <div className="col-span-6 lg:col-span-4">
          <StatCard 
            title="Lỗi phát sinh" 
            value="03" 
            icon="warning"
            description="thất bại (Tỷ lệ thành công 99.7%)"
            valueColor="text-error"
          />
        </div>
      </div>

      <div className="bg-surface-container-low rounded-xl p-1 overflow-hidden">
        <div className="bg-surface-container-lowest p-6 flex flex-wrap items-center gap-6 ">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Khoảng thời gian</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">calendar_today</span>
              <select className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm focus:ring-1 focus:ring-primary/20 appearance-none">
                <option>Hôm nay, 24 Th05</option>
                <option>7 ngày qua</option>
                <option>30 ngày qua</option>
              </select>
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Người thực hiện</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">badge</span>
              <select className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm focus:ring-1 focus:ring-primary/20 appearance-none">
                <option>Tất cả nhân sự</option>
                <option>Nguyễn Văn A (Admin)</option>
                <option>Lê Thị B (Lễ tân)</option>
              </select>
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Loại thao tác</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">filter_list</span>
              <select className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm focus:ring-1 focus:ring-primary/20 appearance-none">
                <option>Tất cả loại</option>
                <option>Tạo phiếu</option>
                <option>Nhập kho</option>
              </select>
            </div>
          </div>
          <div className="pt-5">
            <button className="px-6 py-2.5 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-all font-medium text-sm flex items-center gap-2">
              Áp dụng bộ lọc
            </button>
          </div>
        </div>

        <DataTable headers={tableHeaders}>
          <tr className="hover:bg-surface-container-low transition-colors group">
            <td className="px-6 py-4 text-sm text-on-surface-variant">14:30 24/05/2024</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">NA</div>
                <span className="text-sm font-semibold text-on-surface">Nguyễn Văn A</span>
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-on-surface-variant">Quản trị viên</td>
            <td className="px-6 py-4 text-sm font-medium">Tạo phiếu tiếp nhận</td>
            <td className="px-6 py-4 text-sm">Tạo phiếu #PTN-1024 cho xe 30A-123.45</td>
            <td className="px-6 py-4">
              <StatusBadge status="success" label="Thành công" />
            </td>
          </tr>
          <tr className="hover:bg-surface-container-low transition-colors group">
            <td className="px-6 py-4 text-sm text-on-surface-variant">14:15 24/05/2024</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">LB</div>
                <span className="text-sm font-semibold text-on-surface">Lê Thị B</span>
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-on-surface-variant">Lễ tân</td>
            <td className="px-6 py-4 text-sm font-medium">Cập nhật khách hàng</td>
            <td className="px-6 py-4 text-sm">Cập nhật sđt khách hàng KH-2940</td>
            <td className="px-6 py-4">
              <StatusBadge status="success" label="Thành công" />
            </td>
          </tr>
          <tr className="hover:bg-surface-container-low transition-colors group">
            <td className="px-6 py-4 text-sm text-on-surface-variant">13:45 24/05/2024</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs">TC</div>
                <span className="text-sm font-semibold text-on-surface">Trần Văn C</span>
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-on-surface-variant">Kỹ thuật viên</td>
            <td className="px-6 py-4 text-sm font-medium">Nhập vật tư</td>
            <td className="px-6 py-4 text-sm">Lỗi kết nối kho khi nhập VT-00922</td>
            <td className="px-6 py-4">
              <StatusBadge status="error" label="Thất bại" />
            </td>
          </tr>
        </DataTable>
      </div>
    </div>
  );
}