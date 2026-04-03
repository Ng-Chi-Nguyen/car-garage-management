import React from "react";
import { SearchInput } from "../../../components/ui/search-input";
import { DataTable } from "../../../components/ui/data-table";
import { SectionCard } from "../../../components/ui/section-card";
import { StatusBadge } from "../../../components/ui/status-badge";
import { StateShell } from "../../../components/ui/state-shell";
import { useInventoryFilters } from "../useInventoryFilters";
import { useInventoryQuery } from "../useInventoryQuery";
import { Link } from "react-router-dom";

export function InventoryList() {
  const { filters, setFilters } = useInventoryFilters();
  const { data, isLoading, error } = useInventoryQuery(filters);

  const tableHeaders = [
    "Mã vật tư",
    "Tên vật tư / NCC",
    "Đơn vị",
    "Tồn kho",
    "Giá vốn",
    "Giá bán",
    "Trạng thái",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[300px]">
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            setFilters({ search: formData.get('search'), page: 1 });
          }}>
          <SearchInput 
            name="search"
            placeholder="Tìm kiếm vật tư, mã phụ tùng..." 
            defaultValue={filters.search}
          />
          </form>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-xl">
                    {['all', 'in_stock', 'low_stock', 'out_of_stock'].map((status) => {
            const labels = {
              all: 'Tất cả',
              in_stock: 'Còn hàng',
              low_stock: 'Sắp hết',
              out_of_stock: 'Hết hàng'
            };
            const isActive = filters.stockStatus === status || (!filters.stockStatus && status === 'all');
            return (
              <button 
                key={status}
                onClick={() => setFilters({ stockStatus: status === 'all' ? undefined : status, page: 1 })}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  isActive 
                    ? 'bg-surface-container-lowest shadow-sm text-primary' 
                    : 'hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {labels[status]}
              </button>
            );
          })}
        </div>
      </div>

      <SectionCard
        title="Danh sách vật tư tồn kho"
        noPadding
        action={
          <div className="flex gap-2">
            <button className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
            <button className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors">
              <span className="material-symbols-outlined">download</span>
            </button>
          </div>
        }
      >
        <StateShell
          isLoading={isLoading}
          error={error}
          isEmpty={!isLoading && (!data?.data || data.data.length === 0)}
          emptyMessage="Không tìm thấy vật tư nào"
        >
          <DataTable headers={tableHeaders}>
            {data?.data?.map((item) => (
              <tr key={item.id} className="hover:bg-surface-container-low transition-colors group">
                <td className="px-6 py-4 font-bold text-primary text-sm">
                  <Link to={`/inventory/stock-card?id=${item.id}`} className="hover:underline">{item.id}</Link>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-on-surface">
                    <Link to={`/inventory/stock-card?id=${item.id}`} className="hover:underline">{item.name}</Link>
                  </p>
                  <p className="text-[10px] text-on-surface-variant font-medium">
                    NCC: {item.supplier}
                  </p>
                  
                </td>
                <td className="px-6 py-4 text-center text-sm font-medium">
                  {item.unit}
                </td>
                <td className={`px-6 py-4 text-right font-bold text-sm ${item.stock < 10 ? 'text-error' : 'text-on-surface'}`}>
                  {item.stock}
                </td>
                <td className="px-6 py-4 text-right text-sm text-on-surface-variant">
                  {item.cost}
                </td>
                <td className="px-6 py-4 text-right text-sm font-bold text-on-surface">
                  {item.price}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={item.statusCode} label={item.status} />
                </td>
              </tr>
            ))}
          </DataTable>
        </StateShell>
      </SectionCard>
    </div>
  );
}
