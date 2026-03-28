import React, { useState } from 'react';
import { DataTable } from '../../components/ui/data-table';
import { SectionCard } from '../../components/ui/section-card';
import { useRepairOrdersQuery } from '../../features/repair-orders/useRepairOrdersQuery';

export default function RepairOrdersListPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useRepairOrdersQuery({ page, limit: 10 });

  const repairOrders = data?.data?.repairOrders || [];
  const pagination = data?.data?.pagination || { page: 1, totalPages: 1 };

  const columns = [
    { header: 'Mã Phiếu', accessor: 'MaPhieuSC' },
    { header: 'Mã Xe', accessor: 'MaXe' },
    { header: 'Ngày SC', cell: (row) => new Date(row.NgaySC).toLocaleDateString('vi-VN') },
    { header: 'Nội dung', accessor: 'NoiDungLoi' },
    { 
      header: 'Tổng tiền', 
      cell: (row) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.TongTien || 0) 
    },
    { header: 'Trạng thái', accessor: 'TrangThai' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <SectionCard title="Danh sách phiếu sửa chữa">
        {isError && <div className="p-8 text-center text-red-500">Lỗi khi tải danh sách.</div>}
        {isLoading && <div className="p-8 text-center text-slate-500">Đang tải danh sách...</div>}
        {!isLoading && !isError && (
          <div className="space-y-4">
            <DataTable 
              columns={columns} 
              data={repairOrders} 
            />
            
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-4">
                <button 
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Trang trước
                </button>
                <span className="text-sm font-medium text-slate-600">
                  Trang {page} / {pagination.totalPages}
                </span>
                <button 
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50"
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                >
                  Trang sau
                </button>
              </div>
            )}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
