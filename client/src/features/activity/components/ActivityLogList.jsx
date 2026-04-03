import React, { useMemo, useState } from "react";
import { DataTable } from "../../../components/ui/data-table";
import { StatusBadge } from "../../../components/ui/status-badge";
import { StateShell } from "../../../components/ui/state-shell";
import { useActivityLogsQuery } from "../useActivityQuery";

const DEFAULT_FILTERS_META = {
  userOptions: [{ value: "all", label: "Tất cả người thực hiện" }],
  actionTypeOptions: [{ value: "all", label: "Tất cả loại" }],
  statusOptions: [{ value: "all", label: "Tất cả trạng thái" }],
};

const formatDateTime = (isoString) => {
  if (!isoString) {
    return { time: "--:--:--", date: "--/--/----" };
  }

  const parsed = new Date(isoString);

  if (Number.isNaN(parsed.getTime())) {
    return { time: "--:--:--", date: "--/--/----" };
  }

  return {
    time: parsed.toLocaleTimeString("vi-VN", { hour12: false }),
    date: parsed.toLocaleDateString("vi-VN"),
  };
};

const buildVisiblePages = ({ currentPage, totalPages }) => {
  if (totalPages <= 1) {
    return [1];
  }

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  const validPages = Array.from(pages)
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((left, right) => left - right);

  const result = [];

  validPages.forEach((page, index) => {
    if (index > 0 && page - validPages[index - 1] > 1) {
      result.push("...");
    }
    result.push(page);
  });

  return result;
};

export function ActivityLogList({ filters, setFilter, setFilters }) {
  const query = useActivityLogsQuery(filters);
  const logsData = query.data;

  const activityLogs = logsData?.activityLogs ?? [];
  const pagination = logsData?.pagination ?? {
    page: Number(filters.page) || 1,
    limit: Number(filters.limit) || 10,
    totalItems: 0,
    totalPages: 0,
  };
  const serverFilters = logsData?.filters ?? DEFAULT_FILTERS_META;

  const [draftFilters, setDraftFilters] = useState({
    period: filters.period,
    user: filters.user,
    actionType: filters.actionType,
    status: filters.status,
    search: filters.search,
  });

  const tableHeaders = [
    "Thời gian",
    "Người thực hiện",
    "Vai trò",
    "Loại thao tác",
    "Nội dung chi tiết",
    "Trạng thái",
    "",
  ];

  const displayFrom = pagination.totalItems === 0
    ? 0
    : ((pagination.page - 1) * pagination.limit) + 1;
  const displayTo = pagination.totalItems === 0
    ? 0
    : Math.min(pagination.page * pagination.limit, pagination.totalItems);

  const visiblePages = useMemo(
    () => buildVisiblePages({
      currentPage: pagination.page,
      totalPages: Math.max(pagination.totalPages, 1),
    }),
    [pagination.page, pagination.totalPages],
  );

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    setFilters({
      period: draftFilters.period,
      user: draftFilters.user,
      actionType: draftFilters.actionType,
      status: draftFilters.status,
      search: draftFilters.search?.trim() || undefined,
      page: 1,
      limit: filters.limit,
    });
  };

  const handlePageChange = (nextPage) => {
    if (nextPage === pagination.page) {
      return;
    }

    setFilter("page", nextPage);
  };

  return (
    <div className="bg-surface-container-low rounded-xl p-1 overflow-hidden">
      <form
        onSubmit={handleFilterSubmit}
        className="bg-surface-container-lowest p-6 flex flex-wrap items-end gap-6 border-b border-surface-container"
      >
        <div className="flex-1 min-w-[220px]">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
            Khoảng thời gian
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              calendar_today
            </span>
            <select
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm focus:ring-1 focus:ring-primary/20 appearance-none"
              value={draftFilters.period}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, period: event.target.value }))}
            >
              <option value="today">Hôm nay</option>
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="all">Toàn bộ</option>
            </select>
          </div>
        </div>

        <div className="flex-1 min-w-[220px]">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
            Người thực hiện
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              badge
            </span>
            <select
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm focus:ring-1 focus:ring-primary/20 appearance-none"
              value={draftFilters.user}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, user: event.target.value }))}
            >
              {(serverFilters.userOptions ?? DEFAULT_FILTERS_META.userOptions).map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 min-w-[220px]">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
            Loại thao tác
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              filter_list
            </span>
            <select
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm focus:ring-1 focus:ring-primary/20 appearance-none"
              value={draftFilters.actionType}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, actionType: event.target.value }))}
            >
              {(serverFilters.actionTypeOptions ?? DEFAULT_FILTERS_META.actionTypeOptions).map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 min-w-[220px]">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
            Trạng thái
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              task_alt
            </span>
            <select
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm focus:ring-1 focus:ring-primary/20 appearance-none"
              value={draftFilters.status}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, status: event.target.value }))}
            >
              {(serverFilters.statusOptions ?? DEFAULT_FILTERS_META.statusOptions).map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 min-w-[260px]">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
            Tìm kiếm
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Tìm theo người dùng, nội dung, vai trò..."
              value={draftFilters.search}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, search: event.target.value }))}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-all font-medium text-sm"
          >
            Áp dụng bộ lọc
          </button>
        </div>
      </form>

      <StateShell query={query}>
        {() => (
          <>
            <DataTable headers={tableHeaders}>
              {activityLogs.map((log) => {
                const normalizedStatus = log.status === "error"
                  ? "error"
                  : log.status === "warning"
                    ? "warning"
                    : "success";
                const formattedDateTime = formatDateTime(log.time);

                return (
                  <tr
                    key={log.id}
                    className="hover:bg-surface-container-low transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm text-on-surface font-medium">
                      {formattedDateTime.time}
                      <br />
                      <span className="text-xs font-normal text-slate-400">
                        {formattedDateTime.date}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-xs font-bold">
                          {log.initials}
                        </div>
                        <span className="text-sm text-on-surface">{log.user}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-primary px-2.5 py-1 bg-primary/10 rounded-lg">
                        {log.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-on-surface">
                        <span className="material-symbols-outlined text-slate-400 text-lg">
                          {log.actionIcon ?? "history"}
                        </span>
                        <span className="text-sm">{log.actionType}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-on-surface max-w-xs truncate">
                      {log.details}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={normalizedStatus} label={log.statusLabel} />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        className="p-2 text-slate-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                        title={log.details}
                      >
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {activityLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    Không tìm thấy dữ liệu.
                  </td>
                </tr>
              )}
            </DataTable>

            <div className="bg-surface-container-lowest px-6 py-4 flex items-center justify-between border-t border-surface-container">
              <p className="text-sm text-on-surface-variant">
                Hiển thị {displayFrom}-{displayTo} của {Number(pagination.totalItems).toLocaleString("vi-VN")} thao tác
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="p-1 rounded-lg hover:bg-surface-container text-slate-400 disabled:opacity-30"
                  disabled={pagination.page <= 1}
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>

                {visiblePages.map((page, index) => {
                  if (page === "...") {
                    return (
                      <span key={`ellipsis-${index}`} className="text-slate-400 mx-1">...</span>
                    );
                  }

                  const isActive = page === pagination.page;

                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={isActive
                        ? "w-8 h-8 rounded-lg bg-primary text-white text-sm font-bold"
                        : "w-8 h-8 rounded-lg hover:bg-surface-container text-sm font-medium"
                      }
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="p-1 rounded-lg hover:bg-surface-container text-slate-400 disabled:opacity-30"
                  disabled={pagination.page >= Math.max(pagination.totalPages, 1)}
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </>
        )}
      </StateShell>
    </div>
  );
}
