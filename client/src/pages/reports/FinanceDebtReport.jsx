import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/ui/page-header";
import { StatCard } from "../../components/ui/stat-card";
import { useReceivablesQuery } from "../../features/finance/useFinanceQuery";
import { exportFinanceDebtors } from "../../features/finance/finance.api";
import { toast } from "sonner";

export default function FinanceDebtReport() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: "",
    groupBy: "vehicle",
  });

  const { data, isLoading, isError } = useReceivablesQuery(filters);

  const fallbackTotalDebt = (data?.items || []).reduce((sum, item) => {
    const debt = Number(item?.outstandingDebt ?? item?.TienNoHienTai ?? item?.TienNo ?? 0);
    return sum + (Number.isFinite(debt) ? debt : 0);
  }, 0);

  const totalDebtValue =
    data?.summary?.totalOutstandingDebt
    ?? data?.summary?.totalDebt
    ?? fallbackTotalDebt;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(val ?? 0));
  };

  const handleExport = async () => {
    try {
      const blob = await exportFinanceDebtors(filters);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `finance-debt-report.xlsx`);
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
      <select 
        value={filters.groupBy}
        onChange={(e) => setFilters({...filters, groupBy: e.target.value, page: 1})}
        className="border rounded px-2 py-2"
      >
        <option value="vehicle">Theo xe</option>
        <option value="customer">Theo khách hàng</option>
      </select>
      <input 
        type="text"
        placeholder="Tìm kiếm..."
        value={filters.search}
        onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
        className="border rounded px-2 py-2"
      />
      <button onClick={handleExport} className="bg-blue-600 text-white px-4 py-2 rounded">
        Xuất Excel
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo Công nợ"
        description="Theo dõi tình hình công nợ xe/khách hàng"
        actions={actions}
      />

      {isLoading ? (
        <div>Đang tải...</div>
      ) : isError ? (
        <div className="text-red-600">Lỗi khi tải báo cáo</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              title="Tổng công nợ"
              value={formatCurrency(totalDebtValue)}
            />
            <StatCard
              title="Số lượng nợ"
              value={data?.summary?.debtorCount ?? data?.pagination?.totalItems ?? data?.items?.length ?? 0}
            />
          </div>

          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-medium mb-4">Chi tiết công nợ</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">{filters.groupBy === 'vehicle' ? 'Biển số' : 'Tên khách hàng'}</th>
                    <th className="px-4 py-2 text-left">{filters.groupBy === 'vehicle' ? 'Khách hàng' : 'Số điện thoại'}</th>
                    <th className="px-4 py-2 text-right">Dư nợ</th>
                    <th className="px-4 py-2 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data?.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">
                        {filters.groupBy === 'vehicle'
                          ? (item.licensePlate || item.BienSo)
                          : (item.customerName || item.TenKhachHang)}
                      </td>
                      <td className="px-4 py-2">
                        {filters.groupBy === 'vehicle'
                          ? (item.customerName || item.TenKhachHang)
                          : (item.phoneNumber || item.DienThoai)}
                      </td>
                      <td className="px-4 py-2 text-right">{formatCurrency(item.outstandingDebt ?? item.TienNoHienTai ?? item.TienNo ?? 0)}</td>
                      <td className="px-4 py-2 text-center">
                        <Link 
                          to={`/finance/receivables?vehicleId=${filters.groupBy === 'vehicle' ? item.vehicleId : ''}`}
                          className="text-blue-600 hover:underline"
                        >
                          Thu tiền
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {(!data?.items || data.items.length === 0) && (
                    <tr>
                      <td colSpan="4" className="px-4 py-2 text-center text-gray-500">
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            <div className="mt-4 flex items-center justify-between">
              <div>
                Trang {data?.pagination?.page || 1} / {data?.pagination?.totalPages || 1}
              </div>
              <div className="flex gap-2">
                <button 
                  disabled={!data?.pagination?.hasPrevPage}
                  onClick={() => setFilters(f => ({...f, page: f.page - 1}))}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Trước
                </button>
                <button 
                  disabled={!data?.pagination?.hasNextPage}
                  onClick={() => setFilters(f => ({...f, page: f.page + 1}))}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
