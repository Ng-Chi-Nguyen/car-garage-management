import React, { useState } from 'react';
import { useCustomersMutations } from '../useCustomersMutations';

export function AddCustomerModal({ onClose }) {
  const { createCustomer } = useCustomersMutations();
  const [formData, setFormData] = useState({
    TenChuXe: '',
    DienThoai: '',
    Email: '',
    DiaChi: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createCustomer.mutate(formData, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-on-surface">Thêm khách hàng mới</h2>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              Họ và tên <span className="text-error">*</span>
            </label>
            <input
              type="text"
              name="TenChuXe"
              value={formData.TenChuXe}
              onChange={handleChange}
              required
              className="w-full p-2.5 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="VD: Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              Số điện thoại <span className="text-error">*</span>
            </label>
            <input
              type="tel"
              name="DienThoai"
              value={formData.DienThoai}
              onChange={handleChange}
              required
              className="w-full p-2.5 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="VD: 0901234567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              Email
            </label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              className="w-full p-2.5 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="VD: nguyenvena@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              Địa chỉ
            </label>
            <input
              type="text"
              name="DiaChi"
              value={formData.DiaChi}
              onChange={handleChange}
              className="w-full p-2.5 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="Nhập địa chỉ"
            />
          </div>

          <div className="pt-4 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={createCustomer.isPending}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {createCustomer.isPending ? 'Đang xử lý...' : 'Thêm khách hàng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
