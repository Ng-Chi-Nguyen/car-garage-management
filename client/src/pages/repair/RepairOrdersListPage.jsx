import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataTable } from '../../components/ui/data-table';
import { SectionCard } from '../../components/ui/section-card';
import { useRepairOrdersQuery } from '../../features/repair-orders/useRepairOrdersQuery';

export default function RepairOrdersListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get('page');
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  // Ensure URL is updated if invalid page
  useEffect(() => {
    if (!pageParam || isNaN(page) || page < 1) {
      setSearchParams(prev => {
        prev.set('page', '1');
        return prev;
      }, { replace: true });
    }
  }, [pageParam, page, setSearchParams]);

  const validPage = isNaN(page) || page < 1 ? 1 : page;

  const { data, isLoading, isError } = useRepairOrdersQuery({ page: validPage, limit: 10 });

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

  const handlePageChange = (newPage) => {
    setSearchParams(prev => {
      prev.set('page', newPage.toString());
      return prev;
    });
  };

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
                  onClick={() => handlePageChange(Math.max(1, validPage - 1))}
                  disabled={validPage === 1}
                >
                  Trang trước
                </button>
                <span className="text-sm font-medium text-slate-600">
                  Trang {validPage} / {pagination.totalPages}
                </span>
                <button 
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50"
                  onClick={() => handlePageChange(Math.min(pagination.totalPages, validPage + 1))}
                  disabled={validPage >= pagination.totalPages}
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
