import React from 'react';
import { PageHeader } from '../../components/ui/page-header';
import { SectionCard } from '../../components/ui/section-card';
import { StatCard } from '../../components/ui/stat-card';

export default function CustomerReportPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Báo cáo khách hàng chuyên sâu" 
        description="Thống kê và phân tích dữ liệu khách hàng"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Tổng số khách hàng" value="1,250" trend={5.2} icon={<span className="material-symbols-outlined">group</span>} />
        <StatCard label="Khách hàng mới (Tháng)" value="45" trend={12.5} icon={<span className="material-symbols-outlined">person_add</span>} />
        <StatCard label="Khách hàng quay lại" value="68%" trend={-2.1} icon={<span className="material-symbols-outlined">replay</span>} />
      </div>

      <SectionCard title="Phân tích doanh thu theo nhóm khách hàng">
        <div className="h-64 flex items-center justify-center bg-surface-container-lowest rounded-xl text-on-surface-variant text-sm">
          [Biểu đồ doanh thu]
        </div>
      </SectionCard>
    </div>
  );
}
