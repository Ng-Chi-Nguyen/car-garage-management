import React from "react";
import { useSearchParams } from "react-router-dom";
import { SectionCard } from "../../../components/ui/section-card";
import { DataTable } from "../../../components/ui/data-table";
import { StateShell } from "../../../components/ui/state-shell";
import { useCustomerDetailQuery } from "../useCustomersQuery";

export function CustomerDetailView() {
  const [searchParams] = useSearchParams();
  const rawId = searchParams.get("id");
  const id = rawId && rawId.trim() !== "" ? rawId : "KH001";
  const { data, isLoading, error } = useCustomerDetailQuery(id);

  return (
    <StateShell isLoading={isLoading} error={error}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionCard title="Thông tin cá nhân">
            <div className="space-y-4">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-on-surface-variant">Mã KH</span>
                <span className="font-medium text-on-surface">{data?.id || "KH001"}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-on-surface-variant">Họ tên</span>
                <span className="font-medium text-on-surface">{data?.name || "Nguyễn Văn A"}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-on-surface-variant">Số điện thoại</span>
                <span className="font-medium text-on-surface">{data?.phone || "0901234567"}</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Danh sách xe">
            <div className="space-y-4">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-on-surface-variant">Biển số</span>
                <span className="font-medium text-on-surface">51A-123.45</span>
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Lịch sử dịch vụ" noPadding>
          <DataTable headers={["Ngày", "Biển số", "Dịch vụ", "Tổng tiền"]}>
            <tr className="hover:bg-surface-container-low/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                2026-03-21
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface">
                51A-123.45
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                Bảo dưỡng định kỳ
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                1,500,000 đ
              </td>
            </tr>
          </DataTable>
        </SectionCard>
      </div>
    </StateShell>
  );
}
