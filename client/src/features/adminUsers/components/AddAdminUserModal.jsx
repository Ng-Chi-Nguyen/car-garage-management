import React, { useState } from "react";
import { toast } from "react-toastify";

import { useCreateAdminUserMutation } from "../useAdminUsersMutation.js";

const initialFormData = {
  TenChuXe: "",
  DienThoai: "",
  Email: "",
  MatKhau: "",
  XacNhanMatKhau: "",
  DiaChi: "",
  ChucVu: "NhanVien",
  TrangThai: "HoatDong",
};

export function AddAdminUserModal({ onClose }) {
  const createAdminUserMutation = useCreateAdminUserMutation();
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "HoatDong" : "BiKhoa") : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    createAdminUserMutation.mutate(
      {
        data: {
          ...formData,
          TenChuXe: formData.TenChuXe.trim(),
          DienThoai: formData.DienThoai.trim(),
          Email: formData.Email.trim(),
          DiaChi: formData.DiaChi.trim(),
        },
      },
      {
        onSuccess: () => {
          toast.success("Tạo nhân viên mới thành công");
          setFormData(initialFormData);
          onClose();
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Tạo nhân viên mới thất bại");
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xl w-full max-w-2xl border border-outline-variant">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-on-surface">Thêm nhân viên mới</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Họ và tên</label>
            <input
              name="TenChuXe"
              value={formData.TenChuXe}
              onChange={handleChange}
              required
              className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Số điện thoại</label>
            <input
              name="DienThoai"
              value={formData.DienThoai}
              onChange={handleChange}
              required
              className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Email</label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
              className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Địa chỉ</label>
            <input
              name="DiaChi"
              value={formData.DiaChi}
              onChange={handleChange}
              className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Mật khẩu tạm</label>
            <input
              type="password"
              name="MatKhau"
              value={formData.MatKhau}
              onChange={handleChange}
              required
              className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Xác nhận mật khẩu</label>
            <input
              type="password"
              name="XacNhanMatKhau"
              value={formData.XacNhanMatKhau}
              onChange={handleChange}
              required
              className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Chức vụ</label>
            <select
              name="ChucVu"
              value={formData.ChucVu}
              onChange={handleChange}
              className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            >
              <option value="NhanVien">Nhân viên</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Trạng thái</label>
            <label className="flex items-center gap-3 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2.5 text-sm text-on-surface">
              <input
                type="checkbox"
                name="TrangThai"
                checked={formData.TrangThai === "HoatDong"}
                onChange={handleChange}
                className="h-4 w-4 accent-primary"
              />
              Đang hoạt động
            </label>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={createAdminUserMutation.isPending}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-primary text-surface hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {createAdminUserMutation.isPending ? "Đang xử lý..." : "Tạo nhân viên"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
