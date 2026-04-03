import React from "react";

export function AdminUsersHeader() {
  return (
    <div className="flex justify-between items-end">
      <div>
        <h3 className="text-2xl font-bold text-slate-900">Hệ thống Nhân sự</h3>
        <p className="text-slate-500 text-sm mt-1">Quản lý và phân quyền cho đội ngũ kỹ thuật và hành chính.</p>
      </div>
      <button className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold text-sm transition-all shadow-sm">
        <span className="material-symbols-outlined text-sm">person_add</span>
        Thêm nhân viên mới
      </button>
    </div>
  );
}
