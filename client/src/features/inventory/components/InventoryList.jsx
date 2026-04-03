import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { SearchInput } from "../../../components/ui/search-input";
import { DataTable } from "../../../components/ui/data-table";
import { SectionCard } from "../../../components/ui/section-card";
import { StatusBadge } from "../../../components/ui/status-badge";
import { StateShell } from "../../../components/ui/state-shell";
import { useInventoryFilters } from "../useInventoryFilters";
import { useInventoryMutations } from "../useInventoryMutations";
import { useInventoryQuery } from "../useInventoryQuery";
import { LOW_STOCK_THRESHOLD } from "../inventory.api";

export function InventoryList({ onEdit }) {
  const { filters, setFilters } = useInventoryFilters();
  const { data, isLoading, error } = useInventoryQuery(filters);
  const { deletePart } = useInventoryMutations();

  const tableHeaders = [
    "Mã vật tư",
    "Tên vật tư / NCC",
    "Đơn vị",
    "Tồn kho",
    "Giá vốn",
    "Giá bán",
    "Trạng thái",
    "Thao tác",
  ];

  const handleDelete = (item) => {
    if (!window.confirm(`Xóa vật tư "${item.name}"?`)) {
      return;
    }

    deletePart.mutate(item.id, {
      onSuccess: (response) => {
        toast.success(response?.message || response?.data?.message || "Đã xóa vật tư thành công.");
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Không thể xóa vật tư.");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="min-w-[300px] flex-1">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              setFilters({ search: formData.get("search"), page: 1 });
            }}
          >
            <SearchInput
              name="search"
              placeholder="Tìm kiếm vật tư, mã phụ tùng..."
              defaultValue={filters.search}
            />
          </form>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-surface-container-low p-1.5">
          {["all", "in_stock", "low", "out_of_stock"].map((status) => {
            const labels = {
              all: "Tất cả",
              in_stock: "Còn hàng",
              low: "Sắp hết",
              out_of_stock: "Hết hàng",
            };
            const isActive = filters.stockStatus === status || (!filters.stockStatus && status === "all");
            return (
              <button
                key={status}
                type="button"
                onClick={() => setFilters({ stockStatus: status === "all" ? undefined : status, page: 1 })}
                className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-high"
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
            <button className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
            <button className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container">
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
              <tr key={item.id} className="group transition-colors hover:bg-surface-container-low">
                <td className="px-6 py-4 text-sm font-bold text-primary">
                  <Link to={`/inventory/stock-card?id=${item.id}`} className="hover:underline">
                    {item.id}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-on-surface">
                    <Link to={`/inventory/stock-card?id=${item.id}`} className="hover:underline">
                      {item.name}
                    </Link>
                  </p>
                  <p className="text-[10px] font-medium text-on-surface-variant">NCC: {item.supplier}</p>
                </td>
                <td className="px-6 py-4 text-center text-sm font-medium">{item.unit}</td>
                <td
                  className={`px-6 py-4 text-right text-sm font-bold ${
                    item.stock <= 0
                      ? "text-error"
                      : item.stock <= LOW_STOCK_THRESHOLD
                        ? "text-warning"
                        : "text-on-surface"
                  }`}
                >
                  {item.stock}
                </td>
                <td className="px-6 py-4 text-right text-sm text-on-surface-variant">{item.cost}</td>
                <td className="px-6 py-4 text-right text-sm font-bold text-on-surface">{item.price}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={item.statusCode} label={item.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit?.(item)}
                      className="rounded-lg border border-outline-variant px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/5"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={deletePart.isPending}
                      className="rounded-lg border border-error/20 px-3 py-1.5 text-xs font-semibold text-error hover:bg-error/5 disabled:opacity-50"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </DataTable>
        </StateShell>
      </SectionCard>
    </div>
  );
}
