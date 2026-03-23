import React from 'react';
import { PageHeader } from '../../components/ui/page-header';
import { StatCard } from '../../components/ui/stat-card';
import { SearchInput } from '../../components/ui/search-input';
import { DataTable } from '../../components/ui/data-table';
import { SectionCard } from '../../components/ui/section-card';
import { StatusBadge } from '../../components/ui/status-badge';

export default function CustomersPage() {
  const tableHeaders = [
    'Mã KH',
    'Chủ xe',
    'Xe Quản lý',
    'Lượt sửa',
    'Tổng chi tiêu',
    'Công nợ',
    'Hạng',
    'Gần nhất'
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Danh sách Khách hàng" 
        description="Theo dõi và quản lý thông tin khách hàng thân thiết"
        actions={<button className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95"><span className="material-symbols-outlined text-sm">person_add</span><span>Thêm khách hàng mới</span></button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng khách hàng" 
          value="1,284" 
          icon="group"
          trend="+12%"
          trendUp={true}
          description="Khách hàng có lịch sử giao dịch"
        />
        <StatCard 
          title="Khách hàng VIP" 
          value="42" 
          icon="workspace_premium"
          description="Chiếm 3.2% tổng số"
        />
        <StatCard 
          title="Tổng công nợ" 
          value="152.4M" 
          icon="account_balance_wallet"
          description="Cần thu hồi từ 18 khách"
          valueColor="text-error"
        />
        <StatCard 
          title="Lượt sửa chữa/Tháng" 
          value="312" 
          icon="speed"
          description="Trung bình 10.4 lượt/ngày"
        />
      </div>

      <div className="bg-surface-container-low p-4 rounded-xl flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[300px]">
          <SearchInput placeholder="Tìm kiếm tên, số điện thoại hoặc mã khách hàng..." />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-on-surface-variant">Hạng:</label>
          <select className="bg-surface-container-lowest border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20">
            <option>Tất cả</option>
            <option>VIP</option>
            <option>Thân thiết</option>
            <option>Thường xuyên</option>
            <option>Mới</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-on-surface-variant">Sắp xếp:</label>
          <select className="bg-surface-container-lowest border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20">
            <option>Giao dịch gần nhất</option>
            <option>Tổng chi tiêu giảm dần</option>
            <option>Công nợ tăng dần</option>
          </select>
        </div>
        <button className="flex items-center gap-2 text-primary font-semibold text-sm px-4">
          <span className="material-symbols-outlined">filter_list</span>
          <span>Bộ lọc nâng cao</span>
        </button>
      </div>

      <SectionCard noPadding>
        <DataTable headers={tableHeaders}>
          <tr className="hover:bg-surface-container-low/50 transition-colors group">
            <td className="px-6 py-4 text-sm font-medium text-primary">#KH-2940</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">NL</div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">Nguyễn Lâm Anh</p>
                  <p className="text-xs text-on-surface-variant">090 123 4567</p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-on-surface">3 xe (30A-123.45...)</td>
            <td className="px-6 py-4 text-sm font-semibold text-center">24</td>
            <td className="px-6 py-4 text-sm font-bold">85,400,000đ</td>
            <td className="px-6 py-4 text-sm text-on-surface-variant">—</td>
            <td className="px-6 py-4">
              <StatusBadge status="warning" label="VIP" />
            </td>
            <td className="px-6 py-4 text-sm text-on-surface-variant">Hôm qua</td>
          </tr>
          <tr className="hover:bg-surface-container-low/50 transition-colors group">
            <td className="px-6 py-4 text-sm font-medium text-primary">#KH-1123</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">TH</div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">Trần Hoàng Nam</p>
                  <p className="text-xs text-on-surface-variant">098 765 4321</p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-on-surface">1 xe (30G-987.65)</td>
            <td className="px-6 py-4 text-sm font-semibold text-center">5</td>
            <td className="px-6 py-4 text-sm font-bold">12,500,000đ</td>
            <td className="px-6 py-4 text-sm font-bold text-error">3,200,000đ</td>
            <td className="px-6 py-4">
              <StatusBadge status="info" label="Thân thiết" />
            </td>
            <td className="px-6 py-4 text-sm text-on-surface-variant">12 thg 10</td>
          </tr>
        </DataTable>
      </SectionCard>
    </div>
  );
}