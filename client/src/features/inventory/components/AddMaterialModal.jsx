import React, { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useInventoryMutations } from '../useInventoryMutations.js';
import { useSuppliersQuery } from '../useInventoryQuery.js';
import { SUPPLIER_KEYS } from '../inventory.queryKeys.js';

const createEmptyMaterial = (initialValues = {}) => ({
  TenVatTu: initialValues?.name ?? '',
  DonViTinh: initialValues?.unit ?? '',
  GiaVon: initialValues?.costValue ?? initialValues?.GiaVon ?? '',
  DonGiaBan: initialValues?.priceValue ?? initialValues?.DonGiaBan ?? '',
  MaNCC: initialValues?.supplierId ? String(initialValues.supplierId) : '',
});

const createEmptySupplier = () => ({
  TenNCC: '',
  DienThoai: '',
  DiaChi: '',
  Email: '',
  NguoiLienHe: '',
});

function SupplierMiniModal({ isPending, onClose, onSubmit }) {
  const [formData, setFormData] = useState(createEmptySupplier());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-bold text-on-surface">Tạo nhà cung cấp mới</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData, () => setFormData(createEmptySupplier()));
          }}
          className="space-y-4"
        >
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface-variant">Tên NCC *</label>
            <input name="TenNCC" required value={formData.TenNCC} onChange={handleChange} className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 text-sm focus:border-primary focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface-variant">Điện thoại *</label>
            <input name="DienThoai" required value={formData.DienThoai} onChange={handleChange} className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 text-sm focus:border-primary focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface-variant">Địa chỉ *</label>
            <input name="DiaChi" required value={formData.DiaChi} onChange={handleChange} className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 text-sm focus:border-primary focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface-variant">Email</label>
            <input name="Email" type="email" value={formData.Email} onChange={handleChange} className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 text-sm focus:border-primary focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface-variant">Người liên hệ</label>
            <input name="NguoiLienHe" value={formData.NguoiLienHe} onChange={handleChange} className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 text-sm focus:border-primary focus:outline-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container">Hủy</button>
            <button type="submit" disabled={isPending} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{isPending ? 'Đang lưu...' : 'Lưu NCC'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AddMaterialModal({ mode = 'create', initialValues, onClose, onSuccess }) {
  const queryClient = useQueryClient();
  const { createPart, updatePart, createSupplier } = useInventoryMutations();
  const { data: suppliers = [] } = useSuppliersQuery();

  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState(() => createEmptyMaterial(initialValues));
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

  const title = useMemo(() => (mode === 'edit' ? 'Sửa vật tư' : 'Thêm vật tư mới'), [mode]);
  const submitLabel = mode === 'edit' ? 'Lưu thay đổi' : 'Lưu vật tư';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const payload = {
      TenVatTu: formData.TenVatTu,
      DonViTinh: formData.DonViTinh,
      GiaVon: Number(formData.GiaVon),
      DonGiaBan: Number(formData.DonGiaBan),
      MaNCC: formData.MaNCC ? Number(formData.MaNCC) : null,
    };

    const mutation = mode === 'edit' ? updatePart : createPart;

    mutation.mutate(mode === 'edit' ? { id: initialValues?.id, payload } : payload, {
      onSuccess: () => {
        toast.success(mode === 'edit' ? 'Cập nhật vật tư thành công.' : 'Thêm vật tư thành công.');
        onSuccess?.();
        onClose();
      },
      onError: (err) => {
        const message = err.response?.data?.message || (mode === 'edit' ? 'Có lỗi xảy ra khi cập nhật vật tư' : 'Có lỗi xảy ra khi thêm vật tư');
        setErrorMsg(message);
        toast.error(message);
      },
    });
  };

  const handleCreateSupplier = (supplierPayload, resetSupplierForm) => {
    createSupplier.mutate(supplierPayload, {
      onSuccess: (response) => {
        const payload = response?.data ?? response;
        const supplier = payload?.data?.supplier ?? payload?.supplier ?? payload?.data ?? null;
        const newSupplierId = supplier?.MaNCC ?? supplier?.id ?? supplier?.supplierId;

        if (supplier && newSupplierId != null) {
          queryClient.setQueryData(SUPPLIER_KEYS.list({ limit: 100 }), (currentSuppliers = []) => {
            const nextSupplier = {
              ...supplier,
              MaNCC: newSupplierId,
            };
            const exists = currentSuppliers.some((item) => String(item.MaNCC) === String(newSupplierId));
            return exists
              ? currentSuppliers.map((item) => (String(item.MaNCC) === String(newSupplierId) ? nextSupplier : item))
              : [...currentSuppliers, nextSupplier];
          });
          setFormData((prev) => ({ ...prev, MaNCC: String(newSupplierId) }));
        }

        toast.success(payload?.message || 'Đã tạo nhà cung cấp mới.');
        setIsSupplierModalOpen(false);
        resetSupplierForm?.();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || 'Không thể tạo nhà cung cấp.');
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-surface p-6 shadow-xl">
        <h2 className="mb-6 text-xl font-bold text-on-surface">{title}</h2>

        {errorMsg && <div className="mb-4 rounded-lg bg-error-container p-3 text-sm text-on-error-container">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-on-surface-variant">Tên vật tư *</label>
              <input type="text" name="TenVatTu" required value={formData.TenVatTu} onChange={handleChange} className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 text-sm focus:border-primary focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-on-surface-variant">Đơn vị tính *</label>
              <input type="text" name="DonViTinh" required value={formData.DonViTinh} onChange={handleChange} className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 text-sm focus:border-primary focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-on-surface-variant">Nhà cung cấp</label>
              <div className="flex gap-2">
                <select name="MaNCC" value={formData.MaNCC} onChange={handleChange} className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 text-sm focus:border-primary focus:outline-none">
                  <option value="">-- Chọn NCC --</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.MaNCC} value={supplier.MaNCC}>
                      {supplier.TenNCC}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => setIsSupplierModalOpen(true)} className="shrink-0 rounded-xl border border-primary/20 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/5">
                  Tạo mới NCC
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-on-surface-variant">Giá vốn *</label>
              <input type="number" name="GiaVon" min="0" required value={formData.GiaVon} onChange={handleChange} className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 text-sm focus:border-primary focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-on-surface-variant">Đơn giá bán *</label>
              <input type="number" name="DonGiaBan" min="0" required value={formData.DonGiaBan} onChange={handleChange} className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 text-sm focus:border-primary focus:outline-none" />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-outline-variant/30 pt-4">
            <button type="button" onClick={onClose} disabled={createPart.isPending || updatePart.isPending} className="rounded-xl px-5 py-2.5 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-highest">
              Hủy
            </button>
            <button type="submit" disabled={createPart.isPending || updatePart.isPending} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary/90 disabled:opacity-50">
              {createPart.isPending || updatePart.isPending ? 'Đang lưu...' : submitLabel}
            </button>
          </div>
        </form>

        {isSupplierModalOpen && (
          <SupplierMiniModal
            isPending={createSupplier.isPending}
            onClose={() => setIsSupplierModalOpen(false)}
            onSubmit={handleCreateSupplier}
          />
        )}
      </div>
    </div>
  );
}
