import React from 'react';
import { PageHeader } from '../../components/ui/page-header';
import { StatCard } from '../../components/ui/stat-card';
import { SearchInput } from '../../components/ui/search-input';
import { DataTable } from '../../components/ui/data-table';
import { SectionCard } from '../../components/ui/section-card';
import { StatusBadge } from '../../components/ui/status-badge';

export default function InventoryPage() {
  const tableHeaders = [
    'Mã vật tư',
    'Tên vật tư / Nhóm',
    'Đơn vị',
    'Tồn kho',
    'Giá vốn',
    'Giá bán',
    'Trạng thái'
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader 
          title="Quản lý Kho Vật tư" 
          description="Theo dõi và quản lý tình trạng tồn kho vật tư, phụ tùng"
        />
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-semibold text-sm shadow-md hover:scale-[0.98] transition-transform duration-300">
            <span className="material-symbols-outlined">add</span>
            Thêm vật tư
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-lowest text-primary border border-primary/10 rounded-xl font-semibold text-sm shadow-sm hover:bg-primary-fixed transition-colors">
            <span className="material-symbols-outlined">input</span>
            Nhập kho nhanh
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-lowest text-secondary border border-outline-variant/30 rounded-xl font-semibold text-sm shadow-sm hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined">history_edu</span>
            Xem thẻ kho
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[300px]">
          <SearchInput placeholder="Tìm kiếm vật tư, mã phụ tùng..." />
        </div>
        <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-xl">
          <button className="px-4 py-1.5 bg-surface-container-lowest shadow-sm rounded-lg text-xs font-bold text-primary">Tất cả</button>
          <button className="px-4 py-1.5 hover:bg-surface-container-high rounded-lg text-xs font-bold text-slate-500 transition-colors">Dầu nhớt</button>
          <button className="px-4 py-1.5 hover:bg-surface-container-high rounded-lg text-xs font-bold text-slate-500 transition-colors">Bugi</button>
          <button className="px-4 py-1.5 hover:bg-surface-container-high rounded-lg text-xs font-bold text-slate-500 transition-colors">Lốp xe</button>
          <button className="px-4 py-1.5 hover:bg-surface-container-high rounded-lg text-xs font-bold text-slate-500 transition-colors">Phụ tùng máy</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-3">
          <StatCard 
            title="Tổng mặt hàng" 
            value="1,284" 
            icon="inventory"
            trend="+12% tháng này"
            trendUp={true}
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <StatCard 
            title="Vật tư sắp hết" 
            value="24" 
            icon="warning"
            description="Cần nhập thêm ngay"
            valueColor="text-error"
          />
        </div>
        <div className="col-span-12 md:col-span-6 bg-surface-container-lowest p-6 rounded-3xl shadow-sm flex items-center justify-between gap-6">
          <div className="flex-1">
            <p className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-tight">Giá trị kho hiện tại</p>
            <h3 className="text-3xl font-bold text-on-surface">4.820.500.000 <span className="text-sm font-medium text-slate-400">VNĐ</span></h3>
            <div className="mt-4 flex gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="text-[10px] font-bold text-slate-600">Phụ tùng: 70%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                <span className="text-[10px] font-bold text-slate-600">Dầu nhớt: 20%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                <span className="text-[10px] font-bold text-slate-600">Khác: 10%</span>
              </div>
            </div>
          </div>
          <div className="w-32 h-20 bg-slate-50 rounded-xl flex items-end p-2 gap-1">
            <div className="w-1/4 bg-blue-200 h-[40%] rounded-sm"></div>
            <div className="w-1/4 bg-blue-300 h-[60%] rounded-sm"></div>
            <div className="w-1/4 bg-blue-500 h-[90%] rounded-sm"></div>
            <div className="w-1/4 bg-blue-700 h-[75%] rounded-sm"></div>
          </div>
        </div>
      </div>

      <SectionCard 
        title="Danh sách vật tư tồn kho" 
        noPadding
        action={
          <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
              <span className="material-symbols-outlined">download</span>
            </button>
          </div>
        }
      >
        <DataTable headers={tableHeaders}>
          <tr className="hover:bg-surface-container-low transition-colors group">
            <td className="px-6 py-4 font-bold text-blue-700 text-sm">VT-00921</td>
            <td className="px-6 py-4">
              <p className="text-sm font-semibold text-on-surface">Dầu nhớt Castrol Power1 10W-40</p>
              <p className="text-[10px] text-slate-400 font-medium">Nhóm: Dầu nhớt & Phụ gia</p>
            </td>
            <td className="px-6 py-4 text-center text-sm font-medium">Chai 1L</td>
            <td className="px-6 py-4 text-right font-bold text-sm">142</td>
            <td className="px-6 py-4 text-right text-sm text-slate-500">125,000</td>
            <td className="px-6 py-4 text-right text-sm font-bold text-on-surface">185,000</td>
            <td className="px-6 py-4">
              <StatusBadge status="success" label="Đủ hàng" />
            </td>
          </tr>
          <tr className="hover:bg-surface-container-low transition-colors group">
            <td className="px-6 py-4 font-bold text-blue-700 text-sm">VT-00922</td>
            <td className="px-6 py-4">
              <p className="text-sm font-semibold text-on-surface">Bugi NGK Iridium CPR8EAIX-9</p>
              <p className="text-[10px] text-slate-400 font-medium">Nhóm: Điện & Đánh lửa</p>
            </td>
            <td className="px-6 py-4 text-center text-sm font-medium">Cái</td>
            <td className="px-6 py-4 text-right font-bold text-sm text-error">5</td>
            <td className="px-6 py-4 text-right text-sm text-slate-500">225,000</td>
            <td className="px-6 py-4 text-right text-sm font-bold text-on-surface">285,000</td>
            <td className="px-6 py-4">
              <StatusBadge status="error" label="Sắp hết" />
            </td>
          </tr>
        </DataTable>
      </SectionCard>
    </div>
  );
}