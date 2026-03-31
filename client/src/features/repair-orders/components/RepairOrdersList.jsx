import React from "react";
import { DataTable } from "../../../components/ui/data-table";
import { SectionCard } from "../../../components/ui/section-card";
import { StateShell } from "../../../components/ui/state-shell";
import { useRepairOrdersQuery } from "../useRepairOrdersQuery";
import { useRepairOrdersFilters } from "../useRepairOrdersFilters";

export function RepairOrdersList() {
  const { filters, setFilters } = useRepairOrdersFilters();

  const { data, isLoading, isError, error } = useRepairOrdersQuery({
    page: filters.page,
    limit: 10,
    search: filters.search,
  });

  const repairOrders = data?.data?.repairOrders || [];
  const pagination = data?.data?.pagination || { page: 1, totalPages: 1 };

  const columns = [
    { header: "Mã Phiếu", accessor: "MaPhieuSC" },
    { header: "Mã Xe", accessor: "MaXe" },
    {
      header: "Ngày SC",
      cell: (row) =>
        row.NgaySC && !isNaN(new Date(row.NgaySC).getTime())
          ? new Date(row.NgaySC).toLocaleDateString("vi-VN")
          : "-",
    },
    { header: "Nội dung", accessor: "NoiDungLoi" },
    {
      header: "Tổng tiền",
      cell: (row) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(row.TongTien || 0),
    },
    { header: "Trạng thái", accessor: "TrangThai" },
  ];

  const handlePageChange = (newPage) => {
    setFilters({ page: newPage });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchTerm = formData.get("search")?.toString() || "";
    setFilters({ search: searchTerm, page: 1 });
  };

  return (
    <SectionCard title="Danh sách phiếu sửa chữa">
      <div className="mb-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            name="search"
            type="text"
            defaultValue={filters.search}
            placeholder="Tìm kiếm phiếu sửa chữa..."
            className="px-4 py-2 border rounded-lg flex-1 max-w-sm"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
          >
            Tìm kiếm
          </button>
        </form>
      </div>

      <StateShell 
        isLoading={isLoading} 
        isError={isError} 
        error={error}
        isEmpty={repairOrders.length === 0 && !isLoading && !isError}
        emptyMessage="Không tìm thấy phiếu sửa chữa nào."
      >
        <div className="space-y-4">
          <DataTable columns={columns} data={repairOrders} />

          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50"
                onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
                disabled={filters.page === 1}
              >
                Trang trước
              </button>
              <span className="text-sm font-medium text-slate-600">
                Trang {filters.page} / {pagination.totalPages}
              </span>
              <button
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50"
                onClick={() =>
                  handlePageChange(Math.min(pagination.totalPages, filters.page + 1))
                }
                disabled={filters.page >= pagination.totalPages}
              >
                Trang sau
              </button>
            </div>
          )}
        </div>
      </StateShell>
    </SectionCard>
  );
}