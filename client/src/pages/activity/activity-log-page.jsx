import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { PageHeader } from "../../components/ui/page-header";
import { ActivityStats } from "../../features/activity/components/ActivityStats";
import { ActivityLogList } from "../../features/activity/components/ActivityLogList";
import { useActivityFilters } from "../../features/activity/useActivityFilters";
import { ACTIVITY_KEYS } from "../../features/activity/activity.queryKeys";

export default function ActivityLogPage() {
  const queryClient = useQueryClient();
  const { filters, setFilter, setFilters } = useActivityFilters();

  const handleRefreshData = async () => {
    await queryClient.invalidateQueries({ queryKey: ACTIVITY_KEYS.all });
    toast.success("Đã làm mới dữ liệu nhật ký thao tác.");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Nhật ký thao tác"
        description="Giám sát và kiểm tra toàn bộ hoạt động hệ thống Gara."
        actions={
          <div className="flex gap-3">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-white text-on-surface-variant font-medium rounded-lg border border-outline-variant/30 hover:bg-slate-50 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">
                file_download
              </span>
              Xuất báo cáo (Excel)
            </button>
            <button
              type="button"
              onClick={handleRefreshData}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-container transition-all shadow-md shadow-primary/20"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
              Làm mới dữ liệu
            </button>
          </div>
        }
      />

      <ActivityStats filters={filters} />
      <ActivityLogList
        filters={filters}
        setFilter={setFilter}
        setFilters={setFilters}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-transparent flex gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">security</span>
          </div>
          <div>
            <h5 className="font-bold text-on-surface text-sm">Chính sách bảo mật</h5>
            <p className="text-xs text-on-surface-variant mt-1">
              Dữ liệu nhật ký được lưu trữ có kiểm soát truy cập và phục vụ đối soát vận hành toàn hệ thống.
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-transparent flex gap-4">
          <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              bolt
            </span>
          </div>
          <div>
            <h5 className="font-bold text-on-surface text-sm">Đồng bộ theo truy vấn</h5>
            <p className="text-xs text-on-surface-variant mt-1">
              Bộ lọc và phân trang dùng URL làm nguồn sự thật, hỗ trợ chia sẻ link và quay lại đúng ngữ cảnh.
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-transparent flex gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">cloud_done</span>
          </div>
          <div>
            <h5 className="font-bold text-on-surface text-sm">Nguồn dữ liệu thực</h5>
            <p className="text-xs text-on-surface-variant mt-1">
              Dữ liệu lấy trực tiếp từ API /api/v1/activity, tổng hợp từ phiếu sửa chữa, thu tiền, nhập kho và khách hàng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
