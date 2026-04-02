import React from "react";
import { useSearchParams } from "react-router-dom";
import { SectionCard } from "../../../components/ui/section-card";
import { DataTable } from "../../../components/ui/data-table";
import { StateShell } from "../../../components/ui/state-shell";
import { useCustomerDetailQuery } from "../useCustomersQuery";

function formatCurrency(amount) {
  if (!amount && amount !== 0) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function CustomerDetailView() {
  const [searchParams] = useSearchParams();
  const rawId = searchParams.get("id");
  const id = rawId && rawId.trim() !== "" ? rawId : "KH001";
  const { data, isLoading, error } = useCustomerDetailQuery(id);

  return (
    <StateShell isLoading={isLoading} error={error}>
      {/* Top action buttons */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-primary text-white hover:bg-primary-container transition-colors shadow-sm">
          <span className="material-symbols-outlined text-sm">edit</span>
          Chỉnh sửa hồ sơ
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-surface-container text-on-surface hover:bg-surface-container-high border border-outline/50 transition-colors">
          <span className="material-symbols-outlined text-sm">directions_car</span>
          Thêm xe mới
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-surface-container text-on-surface hover:bg-surface-container-high border border-outline/50 transition-colors">
          <span className="material-symbols-outlined text-sm">receipt_long</span>
          Tạo phiếu sửa chữa
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Bento profile layout */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline/20 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/20 to-tertiary/20"></div>
            <div className="relative pt-12 flex flex-col items-center text-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg border-4 border-surface-container-lowest mb-4 bg-${data?.avatarColor || 'primary'}`}>
                {data?.initials || "KH"}
              </div>
              <h2 className="text-2xl font-bold text-on-surface">{data?.name || "Nguyễn Văn A"}</h2>
              <p className="text-on-surface-variant font-medium mt-1">{data?.id || "KH001"}</p>
              
              <div className="mt-4 px-3 py-1 rounded-full text-sm font-semibold bg-primary/10 text-primary">
                {data?.rank || "Khách hàng"}
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">call</span>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant">Điện thoại</p>
                  <p className="text-sm font-medium text-on-surface">{data?.phone || "Chưa cập nhật"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">mail</span>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant">Email</p>
                  <p className="text-sm font-medium text-on-surface">{data?.email || "Chưa cập nhật"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant">Địa chỉ</p>
                  <p className="text-sm font-medium text-on-surface">{data?.address || "Chưa cập nhật"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Panel */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline/20 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">sticky_note_2</span>
                Ghi chú
              </h3>
              <button className="text-primary hover:bg-primary/10 p-1.5 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low text-sm text-on-surface-variant leading-relaxed">
              Khách hàng VIP, thường xuyên bảo dưỡng định kỳ đúng hạn. Ưu tiên sắp xếp lịch vào cuối tuần.
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Vehicles */}
        <div className="lg:col-span-8 space-y-6">
          {/* KPI row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline/20 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">directions_car</span>
              </div>
              <div>
                <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Tổng số xe</p>
                <p className="text-2xl font-bold text-on-surface">{data?.carsCount || 0}</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline/20 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <div>
                <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Tổng chi tiêu</p>
                <p className="text-2xl font-bold text-on-surface">{formatCurrency(data?.totalSpent)}</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline/20 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center text-error">
                <span className="material-symbols-outlined">money_off</span>
              </div>
              <div>
                <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Công nợ</p>
                <p className="text-2xl font-bold text-on-surface">{formatCurrency(data?.totalDebt)}</p>
              </div>
            </div>
          </div>

          {/* Vehicle Cards */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline/20 shadow-sm">
            <h3 className="font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">garage</span>
              Danh sách xe
            </h3>
            
            {data?.Xe && data.Xe.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.Xe.map((xe, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-outline/30 bg-surface-container-lowest hover:border-primary/50 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                        <span className="material-symbols-outlined">directions_car</span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{xe.BienSo}</p>
                        <p className="text-sm text-on-surface-variant">{xe.HieuXe?.TenHieuXe || "Chưa cập nhật"}</p>
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-surface-container text-primary transition-all">
                      <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-on-surface-variant bg-surface-container-lowest rounded-xl border border-dashed border-outline">
                Chưa có thông tin xe
              </div>
            )}
          </div>

          {/* Timeline / History */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline/20 shadow-sm">
            <h3 className="font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span>
              Lịch sử dịch vụ
            </h3>
            <div className="overflow-x-auto">
              <DataTable headers={["Ngày", "Biển số", "Loại dịch vụ", "Trạng thái", "Tổng tiền"]}>
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                    2026-03-21
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                    51A-123.45
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                    Bảo dưỡng định kỳ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">Hoàn thành</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">
                    1,500,000 đ
                  </td>
                </tr>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </StateShell>
  );
}
