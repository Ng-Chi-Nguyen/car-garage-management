import React from "react";
import { PageHeader } from "../../components/ui/page-header";
import { ActivityStats } from "../../features/activity/components/ActivityStats";
import { ActivityLogList } from "../../features/activity/components/ActivityLogList";

export default function ActivityLogPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Nhật ký thao tác"
        description="Giám sát và kiểm tra toàn bộ hoạt động hệ thống Gara."
        actions={
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-on-surface-variant font-medium rounded-lg border border-outline-variant/30 hover:bg-slate-50 transition-all shadow-sm">
              <span className="material-symbols-outlined text-lg">
                file_download
              </span>
              Xuất báo cáo (Excel)
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-container transition-all shadow-md shadow-primary/20">
              <span className="material-symbols-outlined text-lg">refresh</span>
              Làm mới dữ liệu
            </button>
          </div>
        }
      />

      <ActivityStats />
      <ActivityLogList />
    </div>
  );
}
