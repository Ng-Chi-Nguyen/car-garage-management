import React from "react";

export function AdminUsersFilters({ roleFilter, setRoleFilter, statusFilter, setStatusFilter }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">filter_list</span>
        <span className="text-sm font-medium text-on-surface-variant">Lọc:</span>
      </div>
      <div className="flex gap-2">
        <select
          className="bg-surface-container-low border border-outline-variant text-sm text-on-surface rounded-xl py-2 px-3 pr-8 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">Tất cả vai trò</option>
          <option value="Admin">Admin</option>
          <option value="NhanVien">Nhân viên / Kỹ thuật</option>
          <option value="KhachHang">Khách hàng</option>
        </select>
        <select
          className="bg-surface-container-low border border-outline-variant text-sm text-on-surface rounded-xl py-2 px-3 pr-8 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Trạng thái (Tất cả)</option>
          <option value="HoatDong">Hoạt động</option>
          <option value="BiKhoa">Bị khóa</option>
        </select>
      </div>
    </div>
  );
}
