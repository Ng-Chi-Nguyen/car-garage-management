import React from "react";
import { SearchInput } from "../../../components/ui/search-input";
import { DataTable } from "../../../components/ui/data-table";
import { SectionCard } from "../../../components/ui/section-card";
import { StatusBadge } from "../../../components/ui/status-badge";
import { StateShell } from "../../../components/ui/state-shell";
import { useCustomersFilters } from "../useCustomersFilters";
import { useCustomersQuery } from "../useCustomersQuery";
import { Link } from "react-router-dom";

export function CustomersList() {
  const { filters, setFilters } = useCustomersFilters();
  const { data, isLoading, error } = useCustomersQuery(filters);

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

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-low p-4 rounded-xl flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[300px]">
          <SearchInput 
            placeholder="Tìm kiếm tên, số điện thoại hoặc mã khách hàng..." 
            value={filters.search}
            onChange={(val) => setFilters({ search: val })}
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-on-surface-variant">
            Hạng:
          </label>
          <select 
            className="bg-surface-container-lowest border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20"
            value={filters.rank}
            onChange={(e) => setFilters({ rank: e.target.value })}
          >
            <option value="all">Tất cả</option>
            <option value="vip">VIP</option>
            <option value="loyal">Thân thiết</option>
            <option value="regular">Thường xuyên</option>
            <option value="new">Mới</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-on-surface-variant">
            Sắp xếp:
          </label>
          <select 
            className="bg-surface-container-lowest border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20"
            value={filters.sort}
            onChange={(e) => setFilters({ sort: e.target.value })}
          >
            <option value="recent">Giao dịch gần nhất</option>
            <option value="spent_desc">Tổng chi tiêu giảm dần</option>
            <option value="debt_asc">Công nợ tăng dần</option>
          </select>
        </div>
        <button className="flex items-center gap-2 text-primary font-semibold text-sm px-4">
          <span className="material-symbols-outlined">filter_list</span>
          <span>Bộ lọc nâng cao</span>
        </button>
      </div>

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
                  {customer.carsCount} xe ({customer.carsSummary})
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-center">{customer.visitCount}</td>
                <td className="px-6 py-4 text-sm font-bold">{customer.totalSpent}</td>
                <td className={`px-6 py-4 text-sm ${customer.debt ? 'font-bold text-error' : 'text-on-surface-variant'}`}>
                  {customer.debt || '—'}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge 
                    status={customer.rank === 'VIP' ? 'warning' : 'info'} 
                    label={customer.rank} 
                  />
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">
                  {customer.lastVisit}
                </td>
              </tr>
            ))}
          </DataTable>
        </StateShell>
      </SectionCard>
    </div>
  );
}
