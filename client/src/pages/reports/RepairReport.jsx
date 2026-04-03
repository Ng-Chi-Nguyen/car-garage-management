import React, { useState } from "react";
import { PageHeader } from "../../components/ui/page-header";
import { StatCard } from "../../components/ui/stat-card";
import { useRepairReportQuery } from "../../features/reports/reports.hooks";
import { exportRepairReport } from "../../features/reports/reports.api";
import { toast } from "react-toastify";

export default function RepairReport() {
  const [filters, setFilters] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
    granularity: 'day'
  });

  const { data, isLoading, isError } = useRepairReportQuery(filters);

  const handleExport = async () => {
    try {
      const blob = await exportRepairReport(filters);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `repair-report-${filters.from}-to-${filters.to}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success("Xuất báo cáo thành công");
    } catch {
      toast.error("Lỗi khi xuất báo cáo");
    }
  };

  const actions = (
    <div className="flex gap-4">
      <select 
        value={filters.granularity} 
        onChange={(e) => setFilters({...filters, granularity: e.target.value})}
        className="border rounded px-2"
      >
        <option value="day">Theo ngày</option>
        <option value="month">Theo tháng</option>
        <option value="year">Theo năm</option>
      </select>
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
        title="Báo cáo Sửa chữa"
        description="Thống kê lượng xe sửa chữa"
        actions={actions}
      />

      {isLoading ? (
        <div>Đang tải...</div>
      ) : isError ? (
        <div className="text-red-600">Lỗi khi tải báo cáo</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              title="Tổng lượt sửa"
              value={data?.timeseries?.totalRepairOrders || 0}
            />
            <StatCard
              title="Đã hoàn tất"
              value={data?.statusBreakdown?.completed || 0}
            />
            <StatCard
              title="Đang xử lý"
              value={data?.statusBreakdown?.inProgress || 0}
            />
            <StatCard
              title="Đã hủy"
              value={data?.statusBreakdown?.cancelled || 0}
            />
          </div>

          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-medium mb-4">Chi tiết theo thời gian</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Thời gian</th>
                    <th className="px-4 py-2 text-right">Số lượt sửa chữa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data?.timeseries?.items?.map(item => (
                    <tr key={item.label}>
                      <td className="px-4 py-2">{item.label}</td>
                      <td className="px-4 py-2 text-right">{item.repairOrderCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
