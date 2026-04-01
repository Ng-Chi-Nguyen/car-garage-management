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
    "Tên vật tư / Nhóm",
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
          <SearchInput 
            placeholder="Tìm kiếm vật tư, mã phụ tùng..." 
            value={filters.search}
            onChange={(val) => setFilters({ search: val })}
          />
        </div>
        <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-xl">
          {['all', 'oil', 'spark_plug', 'tires', 'engine_parts'].map((cat) => {
            const labels = {
              all: 'Tất cả',
              oil: 'Dầu nhớt',
              spark_plug: 'Bugi',
              tires: 'Lốp xe',
              engine_parts: 'Phụ tùng máy'
            };
            const isActive = filters.category === cat;
            return (
              <button 
                key={cat}
                onClick={() => setFilters({ category: cat })}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  isActive 
                    ? 'bg-surface-container-lowest shadow-sm text-primary' 
                    : 'hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {labels[cat]}
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
                    Nhóm: {item.group}
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
