import React, { useState } from "react";
import { PageHeader } from "../../components/ui/page-header";
import { StatCard } from "../../components/ui/stat-card";
import { useInventoryReportQuery } from "../../features/reports/reports.hooks";
import { exportInventoryReport } from "../../features/reports/reports.api";
import { toast } from "react-toastify";

export default function InventoryReport() {
  const [filters, setFilters] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const { data, isLoading, isError } = useInventoryReportQuery(filters);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  const handleExport = async () => {
    try {
      const blob = await exportInventoryReport(filters);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inventory-report-${filters.from}-to-${filters.to}.xlsx`);
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
        title="Báo cáo Tồn kho"
        description="Thống kê xuất nhập tồn"
        actions={actions}
      />

      {isLoading ? (
        <div>Đang tải...</div>
      ) : isError ? (
        <div className="text-red-600">Lỗi khi tải báo cáo</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Tổng giá trị tồn kho"
              value={formatCurrency(data?.currentInventoryValue?.totalValue)}
            />
            <StatCard
              title="Tổng SL tồn kho"
              value={data?.currentInventoryValue?.totalQuantity || 0}
            />
            <StatCard
              title="SL loại vật tư"
              value={data?.currentInventoryValue?.partCount || 0}
            />
          </div>

          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-medium mb-4">Chi tiết xuất nhập tồn</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Mã VT</th>
                    <th className="px-4 py-2 text-left">Tên VT</th>
                    <th className="px-4 py-2 text-right">Tồn đầu kỳ</th>
                    <th className="px-4 py-2 text-right">Nhập</th>
                    <th className="px-4 py-2 text-right">Xuất</th>
                    <th className="px-4 py-2 text-right">Tồn cuối kỳ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data?.stockMovement?.items?.map(item => (
                    <tr key={item.partId}>
                      <td className="px-4 py-2">{item.partId}</td>
                      <td className="px-4 py-2">{item.partName}</td>
                      <td className="px-4 py-2 text-right">{item.openingQuantity}</td>
                      <td className="px-4 py-2 text-right">{item.importedQuantity}</td>
                      <td className="px-4 py-2 text-right">{item.exportedQuantity}</td>
                      <td className="px-4 py-2 text-right">{item.closingQuantity}</td>
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
