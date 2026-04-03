import React, { useState } from 'react';
import { useInventoryMutations } from '../useInventoryMutations';

export function AddMaterialModal({ onClose }) {
  const { createPart } = useInventoryMutations();
  
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const formData = new FormData(e.currentTarget);
    const payload = {
      TenVatTu: formData.get('TenVatTu'),
      DonViTinh: formData.get('DonViTinh'),
      GiaVon: Number(formData.get('GiaVon')),
      DonGiaBan: Number(formData.get('DonGiaBan')),
      MaNCC: formData.get('MaNCC') ? Number(formData.get('MaNCC')) : null
    };

    createPart.mutate(payload, {
      onSuccess: () => {
        onClose();
        // Assume toast is handled globally or we can use standard approaches.
        // I won't use alert() as requested.
      },
      onError: (err) => {
        setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi thêm vật tư');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-surface p-6 shadow-xl relative">
        <h2 className="text-xl font-bold text-on-surface mb-6">Thêm vật tư mới</h2>
        
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-error-container text-on-error-container text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-on-surface-variant">Tên vật tư *</label>
              <input 
                type="text" 
                name="TenVatTu"
                required
                className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-on-surface-variant">Đơn vị tính *</label>
              <input 
                type="text" 
                name="DonViTinh"
                required
                className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-on-surface-variant">Mã nhà cung cấp</label>
              <input 
                type="number"
                name="MaNCC"
                min="1"
                placeholder="Ví dụ: 1"
                className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-on-surface-variant">Giá vốn *</label>
              <input 
                type="number" 
                name="GiaVon"
                min="0"
                required
                className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-on-surface-variant">Đơn giá bán *</label>
              <input 
                type="number" 
                name="DonGiaBan"
                min="0"
                required
                className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
            <button
              type="button"
              onClick={onClose}
              disabled={createPart.isPending}
              className="px-5 py-2.5 rounded-xl font-medium text-sm text-on-surface-variant hover:bg-surface-container-highest transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={createPart.isPending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-primary text-white shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {createPart.isPending ? 'Đang lưu...' : 'Lưu vật tư'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
