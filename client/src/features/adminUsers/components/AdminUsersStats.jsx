import React from "react";

export function AdminUsersStats({ users = [] }) {
  const total = users.length;
  const active = users.filter((u) => u.TrangThai === "HoatDong").length;
  const admins = users.filter((u) => u.ChucVu === "Admin").length;
  const techs = users.filter((u) => u.ChucVu === "NhanVien").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-surface p-6 rounded-2xl border border-outline-variant flex flex-col gap-4 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-container text-on-primary-container rounded-xl flex-shrink-0">
            <span className="material-symbols-outlined text-[28px] leading-none">groups</span>
          </div>
          <div>
            <span className="text-sm text-on-surface-variant font-medium block">Tổng nhân viên</span>
            <span className="text-3xl font-bold text-on-surface leading-tight mt-1">{total}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-surface p-6 rounded-2xl border border-outline-variant flex flex-col gap-4 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-surface-container-high text-primary rounded-xl flex-shrink-0">
            <span className="material-symbols-outlined text-[28px] leading-none">task_alt</span>
          </div>
          <div>
            <span className="text-sm text-on-surface-variant font-medium block">Đang hoạt động</span>
            <span className="text-3xl font-bold text-on-surface leading-tight mt-1">{active}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-surface p-6 rounded-2xl border border-outline-variant flex flex-col gap-4 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-surface-container-high text-on-surface-variant rounded-xl flex-shrink-0">
            <span className="material-symbols-outlined text-[28px] leading-none">admin_panel_settings</span>
          </div>
          <div>
            <span className="text-sm text-on-surface-variant font-medium block">Quản trị viên</span>
            <span className="text-3xl font-bold text-on-surface leading-tight mt-1">{admins}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-surface p-6 rounded-2xl border border-outline-variant flex flex-col gap-4 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-surface-container-highest text-on-surface-variant rounded-xl flex-shrink-0">
            <span className="material-symbols-outlined text-[28px] leading-none">engineering</span>
          </div>
          <div>
            <span className="text-sm text-on-surface-variant font-medium block">Kỹ thuật viên</span>
            <span className="text-3xl font-bold text-on-surface leading-tight mt-1">{techs}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
