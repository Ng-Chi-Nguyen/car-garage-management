import React from "react";
import { useUpdateAdminUserMutation } from "../useAdminUsersMutation.js";
import { toast } from "react-toastify";

export function AdminUsersTable({ users, pagination, goNext, goPrev }) {
  const mutation = useUpdateAdminUserMutation();

  const handleToggleRole = (user) => {
    const nextRole = user.ChucVu === "Admin" ? "NhanVien" : "Admin";
    mutation.mutate(
      { id: user.MaKH, data: { ChucVu: nextRole } },
      {
        onSuccess: () => toast.success(`Đã đổi vai trò thành ${nextRole === "Admin" ? "Admin" : "Nhân viên"}`),
        onError: () => toast.error("Đổi vai trò thất bại")
      }
    );
  };

  const handleToggleStatus = (user) => {
    const nextStatus = user.TrangThai === "HoatDong" ? "BiKhoa" : "HoatDong";
    mutation.mutate(
      { id: user.MaKH, data: { TrangThai: nextStatus } },
      {
        onSuccess: () => toast.success(`Đã ${nextStatus === "HoatDong" ? "mở khóa" : "khóa"} tài khoản`),
        onError: () => toast.error("Đổi trạng thái thất bại")
      }
    );
  };

  return (
    <div className="bg-surface overflow-x-auto flex flex-col">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant">
            <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Mã NV</th>
            <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Họ tên</th>
            <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Tên đăng nhập</th>
            <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Vai trò</th>
            <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Lần HĐ cuối</th>
            <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Trạng thái</th>
            <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant">
          {users.map((user) => (
            <tr key={user.MaKH} className="hover:bg-surface-container-low transition-colors">
              <td className="px-6 py-4 text-xs font-semibold text-primary">PE-{String(user.MaKH).padStart(3, "0")}</td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-on-surface">{user.TenChuXe}</span>
                  <span className="text-[10px] text-on-surface-variant">{user.Email || user.DienThoai}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-xs text-on-surface-variant font-medium">{user.DienThoai}</td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${user.ChucVu === "Admin" ? "bg-primary-container text-on-primary-container" : "bg-surface-container-high text-on-surface-variant"}`}>
                  {user.roleLabel}
                </span>
              </td>
              <td className="px-6 py-4 text-xs text-on-surface-variant font-medium">—</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${user.TrangThai === "HoatDong" ? "bg-primary" : "bg-error"}`}></span>
                  <span className="text-xs text-on-surface font-medium">
                    {user.TrangThai === "HoatDong" ? "Hoạt động" : user.TrangThai === "BiKhoa" ? "Bị khóa" : "Đã xóa"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleToggleRole(user)}
                    className="p-1.5 rounded-lg hover:bg-surface-container-highest text-on-surface-variant transition-colors"
                    title="Đổi vai trò"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    onClick={() => handleToggleStatus(user)}
                    className={`p-1.5 rounded-lg transition-colors ${user.TrangThai === "HoatDong" ? "hover:bg-error-container text-error" : "hover:bg-primary-container text-primary"}`}
                    title={user.TrangThai === "HoatDong" ? "Khóa" : "Mở khóa"}
                  >
                    <span className="material-symbols-outlined text-[18px]">{user.TrangThai === "HoatDong" ? "lock" : "lock_open"}</span>
                  </button>
                  <button
                    className="p-1.5 rounded-lg text-outline cursor-not-allowed"
                    title="Reset mật khẩu (Chưa hỗ trợ)"
                    disabled
                  >
                    <span className="material-symbols-outlined text-[18px]">key</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="7" className="px-6 py-12 text-center text-sm text-on-surface-variant">
                Không tìm thấy nhân viên nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {pagination && (
        <div className="px-6 py-4 border-t border-outline-variant flex items-center justify-between bg-surface mt-auto">
          <div className="text-sm text-on-surface-variant">
            Trang <span className="font-medium text-on-surface">{pagination.page}</span> / <span className="font-medium text-on-surface">{pagination.totalPages}</span> 
            <span className="mx-2">•</span>
            Tổng <span className="font-medium text-on-surface">{pagination.totalItems}</span> nhân viên
          </div>
          <div className="flex gap-2">
            <button
              onClick={goPrev}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-low disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Trang trước"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button
              onClick={goNext}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-low disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Trang sau"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
