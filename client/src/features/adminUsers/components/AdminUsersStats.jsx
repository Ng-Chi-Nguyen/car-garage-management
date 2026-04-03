import React from "react";

export function AdminUsersStats({ users = [] }) {
  const total = users.length;
  const active = users.filter((u) => u.TrangThai === "HoatDong").length;
  const admins = users.filter((u) => u.ChucVu === "Admin").length;
  const techs = users.filter((u) => u.ChucVu === "NhanVien").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl border flex flex-col gap-4 relative overflow-hidden group">
        <div className="flex justify-between items-start z-10">
          <div className="p-2 bg-blue-100 rounded-lg">
            <span className="material-symbols-outlined text-blue-700">groups</span>
          </div>
        </div>
        <div className="z-10">
          <span className="text-sm text-slate-500 font-medium block">Tổng số nhân viên</span>
          <span className="text-4xl font-bold text-slate-900 mt-1">{total}</span>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border flex flex-col gap-4 relative overflow-hidden group">
        <div className="flex justify-between items-start z-10">
          <div className="p-2 bg-green-100 rounded-lg">
            <span className="material-symbols-outlined text-green-700">task_alt</span>
          </div>
        </div>
        <div className="z-10">
          <span className="text-sm text-slate-500 font-medium block">Đang hoạt động</span>
          <span className="text-4xl font-bold text-slate-900 mt-1">{active}</span>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border flex flex-col gap-4 relative overflow-hidden group">
        <div className="flex justify-between items-start z-10">
          <div className="p-2 bg-orange-100 rounded-lg">
            <span className="material-symbols-outlined text-orange-700">admin_panel_settings</span>
          </div>
        </div>
        <div className="z-10">
          <span className="text-sm text-slate-500 font-medium block">Vai trò Admin</span>
          <span className="text-4xl font-bold text-slate-900 mt-1">{admins}</span>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border flex flex-col gap-4 relative overflow-hidden group">
        <div className="flex justify-between items-start z-10">
          <div className="p-2 bg-blue-100 rounded-lg">
            <span className="material-symbols-outlined text-blue-700">engineering</span>
          </div>
        </div>
        <div className="z-10">
          <span className="text-sm text-slate-500 font-medium block">Kỹ thuật viên</span>
          <span className="text-4xl font-bold text-slate-900 mt-1">{techs}</span>
        </div>
      </div>
    </div>
  );
}
