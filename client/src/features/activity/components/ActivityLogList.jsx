import React from "react";
import { DataTable } from "../../../components/ui/data-table";
import { StatusBadge } from "../../../components/ui/status-badge";
import { StateShell } from "../../../components/ui/state-shell";
import { useActivityLogsQuery } from "../useActivityQuery";
import { useActivityFilters } from "../useActivityFilters";

export function ActivityLogList() {
  const { filters, setFilter } = useActivityFilters();
  const query = useActivityLogsQuery(filters);

  const tableHeaders = [
    "Thời gian",
    "Người thực hiện",
    "Vai trò",
    "Loại thao tác",
    "Nội dung chi tiết",
    "Trạng thái",
  ];

  return (
    <div className="bg-surface-container-low rounded-xl p-1 overflow-hidden">
      <div className="bg-surface-container-lowest p-6 flex flex-wrap items-center gap-6 border-b border-surface-container">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
            Khoảng thời gian
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              calendar_today
            </span>
            <select
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm focus:ring-1 focus:ring-primary/20 appearance-none"
              value={filters.period}
              onChange={(e) => setFilter("period", e.target.value)}
            >
              <option value="today">Hôm nay, 24 Th05</option>
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
            </select>
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
            Người thực hiện
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              badge
            </span>
            <select
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm focus:ring-1 focus:ring-primary/20 appearance-none"
              value={filters.user}
              onChange={(e) => setFilter("user", e.target.value)}
            >
              <option value="all">Tất cả nhân sự</option>
              <option value="user1">Nguyễn Văn A (Admin)</option>
              <option value="user2">Lê Thị B (Lễ tân)</option>
            </select>
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
            Loại thao tác
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              filter_list
            </span>
            <select
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm focus:ring-1 focus:ring-primary/20 appearance-none"
              value={filters.actionType}
              onChange={(e) => setFilter("actionType", e.target.value)}
            >
              <option value="all">Tất cả loại</option>
              <option value="create">Tạo phiếu</option>
              <option value="import">Nhập kho</option>
            </select>
          </div>
        </div>
        <div className="pt-5">
          <button className="px-6 py-2.5 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-all font-medium text-sm flex items-center gap-2">
            Áp dụng bộ lọc
          </button>
        </div>
      </div>

      <StateShell query={query}>
        {({ data }) => (
          <DataTable headers={tableHeaders}>
            {data.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-surface-container-low transition-colors group"
              >
                <td className="px-6 py-4 text-sm text-on-surface-variant">
                  {log.time}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-xs">
                      {log.initials}
                    </div>
                    <span className="text-sm font-semibold text-on-surface">
                      {log.user}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">
                  {log.role}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {log.actionType}
                </td>
                <td className="px-6 py-4 text-sm">{log.details}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={log.status} label={log.statusLabel} />
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  Không tìm thấy dữ liệu.
                </td>
              </tr>
            )}
          </DataTable>
        )}
      </StateShell>
    </div>
  );
}
