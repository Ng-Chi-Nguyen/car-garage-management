import React, { useState } from "react";
import { PageHeader } from "../../components/ui/page-header";
import { StatCard } from "../../components/ui/stat-card";
import { useRevenueReportQuery } from "../../features/reports/reports.hooks";
import { exportRevenueReport } from "../../features/reports/reports.api";
import { toast } from "sonner";

export default function RevenueReport() {
  const [filters, setFilters] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
    granularity: 'day'
  });

  const { data, isLoading, isError } = useRevenueReportQuery(filters);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  const handleExport = async () => {
    try {
      const blob = await exportRevenueReport(filters);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `revenue-composition-${filters.from}-to-${filters.to}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success("Xuất báo cáo thành công");
    } catch (error) {
      toast.error("Lỗi khi xuất báo cáo");
    }
  };

  const actions = (
    <div className="flex gap-4">
      <input 
        type="date" 
        value={filters.from}
        onChange={(e) => setFilters({...filters, from: e.target.value})}
        className="border rounded px-2"
      />
      <input 
        type="date" 
        value={filters.to}
        onChange={(e) => setFilters({...filters, to: e.target.value})}
        className="border rounded px-2"
      />
      <button onClick={handleExport} className="bg-blue-600 text-white px-4 py-2 rounded">
        Xuất Excel
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo Doanh thu"
        description="Thống kê cấu trúc doanh thu"
        actions={actions}
      />

      {isLoading ? (
        <div>Đang tải...</div>
      ) : isError ? (
        <div className="text-red-600">Lỗi khi tải báo cáo</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.groups?.map(group => (
              <StatCard
                key={group.key}
                title={group.label}
                value={formatCurrency(group.totalRevenue)}
              />
            ))}
          </div>

          {data?.groups?.map(group => (
            <div key={group.key} className="bg-white shadow rounded p-4">
              <h3 className="text-lg font-medium mb-4">Chi tiết theo {group.label}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">{group.label}</th>
                      <th className="px-4 py-2 text-right">Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {group.items?.map(item => (
                      <tr key={item.key}>
                        <td className="px-4 py-2">{item.label || 'Khác'}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(item.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}