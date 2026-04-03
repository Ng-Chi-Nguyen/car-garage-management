import React from "react";
import { useUpdateAdminUserMutation } from "../useAdminUsersMutation.js";
import { toast } from "react-toastify";

export function AdminUsersTable({ users }) {
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
    <div className="bg-white overflow-x-auto rounded-b-xl border border-t-0">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b">
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mã NV</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Họ tên</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tên đăng nhập</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vai trò</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => (
            <tr key={user.MaKH} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-xs font-semibold text-primary">PE-{String(user.MaKH).padStart(3, "0")}</td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900">{user.TenChuXe}</span>
                  <span className="text-[10px] text-slate-500">{user.Email || user.DienThoai}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-xs text-slate-700">{user.DienThoai}</td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${user.ChucVu === "Admin" ? "bg-primary/10 text-primary" : "bg-blue-100 text-blue-700"}`}>
                  {user.roleLabel}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${user.TrangThai === "HoatDong" ? "bg-green-500" : "bg-red-500"}`}></span>
                  <span className="text-xs text-slate-700 font-medium">
                    {user.TrangThai === "HoatDong" ? "Hoạt động" : user.TrangThai === "BiKhoa" ? "Bị khóa" : "Đã xóa"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleToggleRole(user)}
                    className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                    title="Đổi vai trò"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button
                    onClick={() => handleToggleStatus(user)}
                    className={`p-1.5 rounded-lg transition-colors ${user.TrangThai === "HoatDong" ? "hover:bg-red-100 text-red-600" : "hover:bg-green-100 text-green-600"}`}
                    title={user.TrangThai === "HoatDong" ? "Khóa" : "Mở khóa"}
                  >
                    <span className="material-symbols-outlined text-sm">{user.TrangThai === "HoatDong" ? "lock" : "lock_open"}</span>
                  </button>
                  <button
                    className="p-1.5 rounded-lg text-slate-300 cursor-not-allowed"
                    title="Reset mật khẩu (Chưa hỗ trợ)"
                    disabled
                  >
                    <span className="material-symbols-outlined text-sm">key</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-sm text-slate-500">
                Không tìm thấy nhân viên nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
