import React from "react";
import PageHeader from "../../components/PageHeader";
import SectionCard from "../../components/SectionCard";
import StatCard from "../../components/StatCard";

export default function CustomerAnalytics() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo khách hàng chuyên sâu"
        subtitle="Thống kê và phân tích dữ liệu khách hàng"
        breadcrumbs={[
          { label: "CRM", path: "/customers" },
          { label: "Khách hàng" },
          { label: "Báo cáo chuyên sâu" },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Tổng số khách hàng"
          value="1,250"
          trend="+5.2%"
          trendDirection="up"
        />
        <StatCard
          title="Khách hàng mới (Tháng)"
          value="45"
          trend="+12.5%"
          trendDirection="up"
        />
        <StatCard
          title="Khách hàng quay lại"
          value="68%"
          trend="-2.1%"
          trendDirection="down"
        />
      </div>

      <SectionCard title="Phân tích doanh thu theo nhóm khách hàng">
        <div className="h-64 flex items-center justify-center bg-slate-50 border border-slate-200 rounded text-slate-400">
          [Biểu đồ doanh thu]
        </div>
      </SectionCard>
    </div>
  );
}
