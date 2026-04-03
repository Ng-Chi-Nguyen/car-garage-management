import React from "react";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newFilters = {
      search: formData.get("search") || "",
      phone: formData.get("phone") || "",
      email: formData.get("email") || "",
      licensePlate: formData.get("licensePlate") || "",
      minDebt: formData.get("minDebt") ? Number(formData.get("minDebt")) : undefined,
      maxDebt: formData.get("maxDebt") ? Number(formData.get("maxDebt")) : undefined,
    };
    setFilters(newFilters);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Tên/Mã KH</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
              </div>
              <input
                type="text"
                name="search"
                defaultValue={filters.search}
                placeholder="Tìm kiếm..."
                className="w-full pl-10 bg-surface-container-lowest border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="w-[140px]">
            <label className="block text-sm font-medium text-on-surface-variant mb-1">SĐT</label>
            <input 
              type="text" 
              name="phone" 
              defaultValue={filters.phone || ""}
              className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20" 
              placeholder="09..." 
            />
          </div>
          <div className="w-[180px]">
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              defaultValue={filters.email || ""}
              className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20" 
              placeholder="abc@..." 
            />
          </div>
          <div className="w-[120px]">
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Biển số</label>
            <input 
              type="text" 
              name="licensePlate" 
              defaultValue={filters.licensePlate || ""}
              className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20" 
              placeholder="51A..." 
            />
          </div>
        </div>
        
        <div className="flex items-end justify-between">
          <div className="flex gap-4">
            <div className="flex gap-2 items-center">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Công nợ từ</label>
                <input 
                  type="number" 
                  name="minDebt" 
                  defaultValue={filters.minDebt || ""}
                  className="w-[120px] bg-surface-container-lowest border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20" 
                  placeholder="0" 
                />
              </div>
              <span className="mt-6 text-on-surface-variant">-</span>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Đến</label>
                <input 
                  type="number" 
                  name="maxDebt" 
                  defaultValue={filters.maxDebt || ""}
                  className="w-[120px] bg-surface-container-lowest border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20" 
                  placeholder="VND" 
                />
              </div>
            </div>
          </div>
          <button type="submit" className="bg-primary text-on-primary font-semibold text-sm px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 h-[40px]">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            <span>Bộ lọc nâng cao</span>
          </button>
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
        </StateShell>
      </SectionCard>
    </div>
  );
}
