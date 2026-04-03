import React from "react";

export function AdminUsersHeader({ onAddNew }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
      <div>
        <h3 className="text-2xl font-bold text-on-surface">Hệ thống Nhân sự</h3>
        <p className="text-on-surface-variant text-sm mt-1">Quản lý và phân quyền cho đội ngũ kỹ thuật và hành chính.</p>
      </div>
      <button type="button" onClick={onAddNew} className="bg-primary hover:bg-primary-700 text-surface px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all shadow-sm">
        <span className="material-symbols-outlined text-sm">person_add</span>
        Thêm nhân viên mới
      </button>
    </div>
  );
}
