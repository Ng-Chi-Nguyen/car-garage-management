import React from "react";
import { useParams } from "react-router-dom";
import { SectionCard } from "../../../components/ui/section-card";
import { DataTable } from "../../../components/ui/data-table";
import { StateShell } from "../../../components/ui/state-shell";
import { useStockDetailQuery } from "../useInventoryQuery";

export function StockDetailView() {
  const { id } = useParams();
  const { data, isLoading, error } = useStockDetailQuery(id || "VT-0012");

  return (
    <StateShell isLoading={isLoading} error={error}>
      <div className="space-y-6">
        <SectionCard title="Thông tin vật tư">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="block text-sm text-on-surface-variant mb-1">Mã vật tư</span>
              <span className="block font-medium text-on-surface">{data?.id || "VT-0012"}</span>
            </div>
            <div>
              <span className="block text-sm text-on-surface-variant mb-1">
                Tên vật tư
              </span>
              <span className="block font-medium text-on-surface">
                {data?.name || "Lọc nhớt Innova"}
              </span>
            </div>
            <div>
              <span className="block text-sm text-on-surface-variant mb-1">
                Đơn vị tính
              </span>
              <span className="block font-medium text-on-surface">Cái</span>
            </div>
            <div>
              <span className="block text-sm text-on-surface-variant mb-1">
                Tồn kho hiện tại
              </span>
              <span className="block font-medium text-on-surface">45</span>
            </div>
            <div>
              <span className="block text-sm text-on-surface-variant mb-1">
                Giá nhập chuẩn
              </span>
              <span className="block font-medium text-on-surface">120,000 đ</span>
            </div>
            <div>
              <span className="block text-sm text-on-surface-variant mb-1">
                Giá bán chuẩn
              </span>
              <span className="block font-medium text-on-surface">150,000 đ</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Lịch sử giao dịch" noPadding>
          <DataTable headers={["Ngày", "Loại", "Số lượng", "Tồn cuối", "Ghi chú"]}>
            <tr className="hover:bg-surface-container-low transition-colors group">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                2026-03-21
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface">
                Xuất
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-error font-medium">
                -2
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface">
                45
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                Sửa chữa xe 51A-123.45
              </td>
            </tr>
            <tr className="hover:bg-surface-container-low transition-colors group">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                2026-03-20
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface">
                Nhập
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-primary font-medium">
                +50
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface">
                47
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                Nhập hàng NCC A
              </td>
            </tr>
          </DataTable>
        </SectionCard>
      </div>
    </StateShell>
  );
}
