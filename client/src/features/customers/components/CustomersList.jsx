import React from "react";
import { DataTable } from "../../../components/ui/data-table";
import { PaginationControls } from "../../../components/ui/pagination-controls";
import { SectionCard } from "../../../components/ui/section-card";
import { StatusBadge } from "../../../components/ui/status-badge";
import { StateShell } from "../../../components/ui/state-shell";
import { useCustomersFilters } from "../useCustomersFilters";
import { useCustomersQuery } from "../useCustomersQuery";
import { Link } from "react-router-dom";

export function CustomersList() {
  const { filters, setFilters } = useCustomersFilters();
  const { data, isLoading, error } = useCustomersQuery(filters);
  const pagination = data?.pagination ?? { page: 1, totalPages: 1, totalItems: 0 };

  const tableHeaders = [
    "Mã KH",
    "Chủ xe",
    "Xe Quản lý",
    "Lượt sửa",
    "Tổng chi tiêu",
    "Công nợ",
    "Hạng",
    "Gần nhất",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newFilters = {
      search: formData.get("search") || "",
    };
    setFilters(newFilters);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage === filters.page) {
      return;
    }
    setFilters({ page: nextPage });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-surface-container-low p-4 rounded-xl flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
            </div>
            <input
              type="text"
              name="search"
              defaultValue={filters.search}
              placeholder="Tìm kiếm theo Tên, Mã KH, SĐT, Email, Địa chỉ, Biển số..."
              className="w-full pl-10 bg-surface-container-lowest border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </form>

      <SectionCard noPadding>
        <StateShell
          isLoading={isLoading}
          error={error}
          isEmpty={!isLoading && (!data?.data || data.data.length === 0)}
          emptyMessage="Không tìm thấy khách hàng nào"
        >
          <DataTable headers={tableHeaders}>
            {data?.data?.map((customer) => (
              <tr key={customer.id} className="hover:bg-surface-container-low/50 transition-colors group">
                <td className="px-6 py-4 text-sm font-medium text-primary">
                  <Link to={`/customers/detail?id=${customer.id}`} className="hover:underline">{customer.id}</Link>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-${customer.avatarColor}-container text-on-${customer.avatarColor}-container`}>
                      {customer.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">
                        <Link to={`/customers/detail?id=${customer.id}`} className="hover:underline">{customer.name}</Link>
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {customer.phone}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-on-surface">
                  {customer.carsCount} xe
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-center">{customer.visitCount}</td>
                <td className="px-6 py-4 text-sm font-bold">{customer.totalSpent}</td>
                <td className={`px-6 py-4 text-sm ${customer.debt && customer.debt !== '0\xa0₫' ? 'font-bold text-error' : 'text-on-surface-variant'}`}>
                  {customer.debt || '—'}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge 
                    status={customer.rank === 'VIP' ? 'warning' : 'info'} 
                    label={customer.rank || 'Mới'} 
                  />
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">
                  {customer.lastVisit || 'Chưa có'}
                </td>
              </tr>
            ))}
          </DataTable>
          <PaginationControls
            page={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </StateShell>
      </SectionCard>
    </div>
  );
}
