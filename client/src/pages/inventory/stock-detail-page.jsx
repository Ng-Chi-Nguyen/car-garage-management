import React from 'react';
import { PageHeader } from '../../components/ui/page-header';
import { SectionCard } from '../../components/ui/section-card';
import { DataTable } from '../../components/ui/data-table';

export default function StockDetailPage() {
  const transactionHeaders = ['Ngày', 'Loại', 'Số lượng', 'Tồn cuối', 'Ghi chú'];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Thẻ kho chi tiết: Lọc nhớt Innova" 
        description="Chi tiết xuất nhập tồn kho"
      />

      <SectionCard title="Thông tin vật tư">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-container-lowest p-3 rounded-xl">
            <span className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-tight">Mã vật tư</span>
            <span className="block font-semibold text-on-surface">VT-0012</span>
          </div>
          <div className="bg-surface-container-lowest p-3 rounded-xl">
            <span className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-tight">Tên vật tư</span>
            <span className="block font-semibold text-on-surface">Lọc nhớt Innova</span>
          </div>
          <div className="bg-surface-container-lowest p-3 rounded-xl">
            <span className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-tight">Đơn vị tính</span>
            <span className="block font-semibold text-on-surface">Cái</span>
          </div>
          <div className="bg-surface-container-lowest p-3 rounded-xl">
            <span className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-tight">Tồn kho hiện tại</span>
            <span className="block font-semibold text-on-surface">45</span>
          </div>
          <div className="bg-surface-container-lowest p-3 rounded-xl">
            <span className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-tight">Giá nhập chuẩn</span>
            <span className="block font-semibold text-on-surface">120,000 đ</span>
          </div>
          <div className="bg-surface-container-lowest p-3 rounded-xl">
            <span className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-tight">Giá bán chuẩn</span>
            <span className="block font-semibold text-on-surface">150,000 đ</span>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Lịch sử giao dịch" noPadding>
        <DataTable headers={transactionHeaders}>
          <tr className="hover:bg-surface-container-low/50 transition-colors group">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">2026-03-21</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">Xuất</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-error">-2</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-on-surface">45</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">Sửa chữa xe 51A-123.45</td>
          </tr>
          <tr className="hover:bg-surface-container-low/50 transition-colors group">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">2026-03-20</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">Nhập</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-success">+50</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-on-surface">47</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">Nhập hàng NCC A</td>
          </tr>
        </DataTable>
      </SectionCard>
    </div>
  );
}
