import React from 'react';
import { PageHeader } from '../../components/ui/page-header';
import { SectionCard } from '../../components/ui/section-card';
import { DataTable } from '../../components/ui/data-table';

export default function CustomerDetailPage() {
  const serviceHeaders = ['Ngày', 'Biển số', 'Dịch vụ', 'Tổng tiền'];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Hồ sơ khách hàng: Nguyễn Văn A" 
        description="Chi tiết thông tin và lịch sử dịch vụ"
        breadcrumbs={[
          { label: 'CRM', path: '/customers' },
          { label: 'Khách hàng', path: '/customers' },
          { label: 'Chi tiết' }
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard title="Thông tin cá nhân">
          <div className="space-y-3">
            <div className="flex justify-between bg-surface-container-lowest p-3 rounded-xl">
              <span className="text-on-surface-variant text-sm font-medium">Mã KH</span>
              <span className="font-semibold text-on-surface text-sm">KH001</span>
            </div>
            <div className="flex justify-between bg-surface-container-lowest p-3 rounded-xl">
              <span className="text-on-surface-variant text-sm font-medium">Họ tên</span>
              <span className="font-semibold text-on-surface text-sm">Nguyễn Văn A</span>
            </div>
            <div className="flex justify-between bg-surface-container-lowest p-3 rounded-xl">
              <span className="text-on-surface-variant text-sm font-medium">Số điện thoại</span>
              <span className="font-semibold text-on-surface text-sm">0901234567</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Danh sách xe">
          <div className="space-y-3">
             <div className="flex justify-between bg-surface-container-lowest p-3 rounded-xl">
              <span className="text-on-surface-variant text-sm font-medium">Biển số</span>
              <span className="font-semibold text-on-surface text-sm">51A-123.45</span>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Lịch sử dịch vụ" noPadding>
        <DataTable headers={serviceHeaders}>
          <tr className="hover:bg-surface-container-low/50 transition-colors group">
            <td className="px-6 py-4 text-sm text-on-surface-variant whitespace-nowrap">2026-03-21</td>
            <td className="px-6 py-4 text-sm font-medium text-on-surface whitespace-nowrap">51A-123.45</td>
            <td className="px-6 py-4 text-sm text-on-surface-variant whitespace-nowrap">Bảo dưỡng định kỳ</td>
            <td className="px-6 py-4 text-sm font-bold text-on-surface whitespace-nowrap">1,500,000 đ</td>
          </tr>
        </DataTable>
      </SectionCard>
    </div>
  );
}
