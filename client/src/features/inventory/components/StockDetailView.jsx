import React from "react";
import { useSearchParams } from "react-router-dom";
import { SectionCard } from "../../../components/ui/section-card";
import { DataTable } from "../../../components/ui/data-table";
import { StateShell } from "../../../components/ui/state-shell";
import { useStockDetailQuery } from "../useInventoryQuery";

export function StockDetailView() {
  const [searchParams] = useSearchParams();
  const idParam = searchParams.get("id");
  const id = idParam?.trim() ? idParam.trim() : null;
  const { data, isLoading, error } = useStockDetailQuery(id);

  return (
    <StateShell isLoading={isLoading} error={error}>
      <div className="space-y-6">
        <SectionCard title="Thông tin vật tư">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="block text-sm text-on-surface-variant mb-1">Mã vật tư</span>
              <span className="block font-medium text-on-surface">{data?.id || ""}</span>
            </div>
            <div>
              <span className="block text-sm text-on-surface-variant mb-1">
                Tên vật tư
              </span>
              <span className="block font-medium text-on-surface">
                {data?.name || ""}
              </span>
            </div>
            <div>
              <span className="block text-sm text-on-surface-variant mb-1">
                Đơn vị tính
              </span>
              <span className="block font-medium text-on-surface">{data?.unit || ""}</span>
            </div>
            <div>
              <span className="block text-sm text-on-surface-variant mb-1">
                Tồn kho hiện tại
              </span>
              <span className="block font-medium text-on-surface">{data?.stock || 0}</span>
            </div>
            <div>
              <span className="block text-sm text-on-surface-variant mb-1">
                Giá nhập chuẩn
              </span>
              <span className="block font-medium text-on-surface">{data?.cost ? new Intl.NumberFormat('vi-VN').format(data.cost) : 0} đ</span>
            </div>
            <div>
              <span className="block text-sm text-on-surface-variant mb-1">
                Giá bán chuẩn
              </span>
              <span className="block font-medium text-on-surface">{data?.price ? new Intl.NumberFormat('vi-VN').format(data.price) : 0} đ</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Lịch sử giao dịch" noPadding>
          <DataTable headers={["Ngày", "Loại", "Số lượng", "Tồn cuối", "Ghi chú"]}>
            {data?.history?.map((historyItem, index) => (
              <tr key={index} className="hover:bg-surface-container-low transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                  {/* historyItem date formatting if present, fallback empty */}
                  {historyItem.PhieuNhapKho?.NgayNhap ? new Date(historyItem.PhieuNhapKho.NgayNhap).toISOString().split('T')[0] : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface">
                  Nhập
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary font-medium">
                  +{historyItem.SoLuong}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface">
                  {/* Cannot calculate exact ending stock trivially without chronological order, show - for now */}
                  -
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                  Nhập hàng
                </td>
              </tr>
            ))}
            {(!data?.history || data.history.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-on-surface-variant">
                  Chưa có lịch sử giao dịch
                </td>
              </tr>
            )}
          </DataTable>
        </SectionCard>
      </div>
    </StateShell>
  );
}
