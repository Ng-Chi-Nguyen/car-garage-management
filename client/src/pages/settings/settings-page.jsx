import React from "react";
import { PageHeader } from "../../components/ui/page-header";
import { SectionCard } from "../../components/ui/section-card";
import { DataTable } from "../../components/ui/data-table";

export default function SettingsPage() {
  const priceHeaders = ["Tên hạng mục", "Thời gian dự kiến", "Đơn giá (VNĐ)"];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Cấu hình hệ thống"
        description="Quản lý các tham số vận hành cốt lõi của Gara"
      />

      <div className="bg-error-container/30 border-l-4 border-error p-4 rounded-xl flex items-start gap-3">
        <span className="material-symbols-outlined text-error">warning</span>
        <div>
          <h4 className="text-on-error-container font-semibold text-sm">
            Cảnh báo vận hành
          </h4>
          <p className="text-on-error-container/80 text-xs mt-0.5">
            Việc thay đổi cấu hình hệ thống sẽ tác động trực tiếp đến quy trình
            vận hành thực tế tại xưởng. Vui lòng kiểm tra kỹ trước khi lưu.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <span className="material-symbols-outlined">
                  directions_car
                </span>
              </div>
              <span className="text-xs font-medium text-slate-400">
                Giới hạn ngày
              </span>
            </div>
            <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
              Số xe tối đa tiếp nhận
            </h3>
            <div className="flex items-baseline gap-2">
              <input
                className="text-4xl font-bold text-on-surface bg-transparent border-none p-0 w-24 focus:ring-0"
                type="number"
                defaultValue="20"
              />
              <span className="text-slate-400 font-medium">xe/ngày</span>
            </div>
            <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-2/3 rounded-full"></div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-tertiary/10 rounded-lg text-tertiary">
                <span className="material-symbols-outlined">percent</span>
              </div>
              <span className="text-xs font-medium text-slate-400">
                Tỉ lệ lợi nhuận
              </span>
            </div>
            <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
              Tỉ lệ lãi suất vật tư
            </h3>
            <div className="flex items-baseline gap-2">
              <input
                className="text-4xl font-bold text-on-surface bg-transparent border-none p-0 w-24 focus:ring-0"
                type="number"
                defaultValue="15"
              />
              <span className="text-slate-400 font-medium">%</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              Áp dụng cho giá bán lẻ vật tư phụ tùng
            </p>
          </div>
        </div>

        <div className="md:col-span-8">
          <SectionCard
            title="Bảng giá tiền công niêm yết"
            noPadding
            action={
              <button className="text-primary text-xs font-semibold hover:underline flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">add</span>{" "}
                Thêm dịch vụ
              </button>
            }
          >
            <DataTable headers={priceHeaders}>
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="py-4 px-6 text-sm font-medium text-on-surface">
                  Thay dầu & Lọc dầu
                </td>
                <td className="py-4 px-6 text-sm text-slate-500 text-center">
                  30 phút
                </td>
                <td className="py-4 px-6 text-sm font-semibold text-right text-primary">
                  150,000
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="py-4 px-6 text-sm font-medium text-on-surface">
                  Bảo dưỡng phanh (4 bánh)
                </td>
                <td className="py-4 px-6 text-sm text-slate-500 text-center">
                  60 phút
                </td>
                <td className="py-4 px-6 text-sm font-semibold text-right text-primary">
                  450,000
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="py-4 px-6 text-sm font-medium text-on-surface">
                  Vệ sinh khoang máy
                </td>
                <td className="py-4 px-6 text-sm text-slate-500 text-center">
                  90 phút
                </td>
                <td className="py-4 px-6 text-sm font-semibold text-right text-primary">
                  800,000
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="py-4 px-6 text-sm font-medium text-on-surface">
                  Đọc lỗi & Xóa lỗi OBD
                </td>
                <td className="py-4 px-6 text-sm text-slate-500 text-center">
                  15 phút
                </td>
                <td className="py-4 px-6 text-sm font-semibold text-right text-primary">
                  200,000
                </td>
              </tr>
            </DataTable>
          </SectionCard>
        </div>

        <div className="md:col-span-12">
          <div className="bg-surface-container-low rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <span className="material-symbols-outlined">garage</span>
              </div>
              <h3 className="text-lg text-on-surface font-semibold">
                Quản lý Hãng xe & Model xe
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-slate-900">TOYOTA</div>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                    12 MODELS
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  Vios, Camry, Fortuner, Corolla Cross...
                </p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-slate-900">HONDA</div>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                    8 MODELS
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  City, Civic, CR-V, HR-V...
                </p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-slate-900">MERCEDES-BENZ</div>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                    15 MODELS
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  C-Class, E-Class, GLC, S-Class...
                </p>
              </div>
              <div className="border-2 border-dashed border-outline-variant/40 p-4 rounded-xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary hover:border-primary/40 transition-all group cursor-pointer">
                <span className="material-symbols-outlined">add_circle</span>
                <span className="text-xs font-semibold">Thêm hãng xe</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
        <div className="text-xs text-slate-500">
          Lần cập nhật cuối:{" "}
          <span className="font-semibold">Hôm nay, 14:32</span> bởi{" "}
          <span className="font-semibold">Admin</span>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 rounded-xl border border-outline text-on-surface font-semibold text-sm hover:bg-slate-50 transition-colors">
            Hủy thay đổi
          </button>
          <button className="px-8 py-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-98 transition-transform flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">save</span>
            Lưu cấu hình
          </button>
        </div>
      </div>
    </div>
  );
}
