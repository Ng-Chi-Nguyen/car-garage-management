import React from "react";
import { SectionCard } from "../../../components/ui/section-card";
import { DataTable } from "../../../components/ui/data-table";
import { StateShell } from "../../../components/ui/state-shell";
import { useServicePricesQuery } from "../useSettingsQuery";

export function ServicePricesTable() {
  const query = useServicePricesQuery();
  const priceHeaders = ["Tên hạng mục", "Thời gian dự kiến", "Đơn giá (VNĐ)"];

  return (
    <SectionCard
      title="Bảng giá tiền công niêm yết"
      noPadding
      action={
        <button className="text-primary text-xs font-semibold hover:underline flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">add</span> Thêm dịch vụ
        </button>
      }
    >
      <StateShell query={query}>
        {({ data }) => (
          <DataTable headers={priceHeaders}>
            {data.map((service) => (
              <tr
                key={service.id}
                className="hover:bg-surface-container-low transition-colors group"
              >
                <td className="py-4 px-6 text-sm font-medium text-on-surface">
                  {service.name}
                </td>
                <td className="py-4 px-6 text-sm text-slate-500 text-center">
                  {service.duration}
                </td>
                <td className="py-4 px-6 text-sm font-semibold text-right text-primary">
                  {service.price.toLocaleString()}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                  Không tìm thấy dữ liệu.
                </td>
              </tr>
            )}
          </DataTable>
        )}
      </StateShell>
    </SectionCard>
  );
}
