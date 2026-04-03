import React from "react";

export function AdminUsersFilters({ roleFilter, setRoleFilter, statusFilter, setStatusFilter }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border-b rounded-t-xl">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">Lọc theo:</span>
        <select
          className="bg-slate-50 border border-slate-200 text-xs rounded-lg py-1.5 px-3 focus:ring-1 focus:ring-primary/30"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">Tất cả vai trò</option>
          <option value="Admin">Admin</option>
          <option value="NhanVien">Kỹ thuật viên / Nhân viên</option>
          <option value="KhachHang">Khách hàng</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <select
          className="bg-slate-50 border border-slate-200 text-xs rounded-lg py-1.5 px-3 focus:ring-1 focus:ring-primary/30"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Trạng thái: Tất cả</option>
          <option value="HoatDong">Hoạt động</option>
          <option value="BiKhoa">Bị khóa</option>
        </select>
      </div>
    </div>
  );
}
