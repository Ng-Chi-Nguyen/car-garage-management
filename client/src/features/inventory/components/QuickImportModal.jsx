import React, { useState, useMemo } from 'react';
import { useInventoryMutations } from '../useInventoryMutations';
import { useInventoryQuery, useSuppliersQuery } from '../useInventoryQuery';

export function QuickImportModal({ onClose }) {
  const { createStockReceipt } = useInventoryMutations();
  const { data: partsData } = useInventoryQuery({ page: 1, limit: 100 });
  const { data: suppliers } = useSuppliersQuery();
  
  const [formData, setFormData] = useState({
    MaVatTu: '',
    SoLuong: '',
    DonGiaNhap: '',
    MaNCC: '',
  });

  const selectedPart = useMemo(() => {
    if (!formData.MaVatTu || !partsData?.data) return null;
    return partsData.data.find(p => p.id === Number(formData.MaVatTu));
  }, [formData.MaVatTu, partsData]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      stockReceipt: {
        MaNCC: Number(formData.MaNCC),
        NgayNhap: new Date().toISOString().split('T')[0],
      },
      details: [
        {
          MaVatTu: Number(formData.MaVatTu),
          SoLuong: Number(formData.SoLuong),
          DonGiaNhap: Number(formData.DonGiaNhap),
        }
      ]
    };
    
    createStockReceipt.mutate(payload, {
      onSuccess: () => {
        onClose();
      },
      onError: (err) => {
        console.error(err);
        // Alert removed as per AGENTS rules. Use toast in a full implementation.
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
          <h2 className="text-xl font-bold text-on-surface">Nhập kho nhanh</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              Nhà cung cấp
            </label>
            <select
              name="MaNCC"
              value={formData.MaNCC}
              onChange={handleChange}
              required
              className="w-full p-2.5 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            >
              <option value="">-- Chọn nhà cung cấp --</option>
              {suppliers?.map(supplier => (
                <option key={supplier.MaNCC} value={supplier.MaNCC}>
                  {supplier.TenNCC}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              Vật tư / Phụ tùng
            </label>
            <select
              name="MaVatTu"
              value={formData.MaVatTu}
              onChange={handleChange}
              required
              className="w-full p-2.5 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            >
              <option value="">-- Chọn vật tư --</option>
              {partsData?.data?.map(part => (
                <option key={part.id} value={part.id}>
                  {part.name} - {part.id}
                </option>
              ))}
            </select>
            {selectedPart && (
              <p className="mt-1 text-sm text-on-surface-variant">
                Tồn kho hiện tại: <span className="font-semibold">{selectedPart.stock}</span> {selectedPart.unit}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              Số lượng nhập
            </label>
            <input
              type="number"
              name="SoLuong"
              min="1"
              value={formData.SoLuong}
              onChange={handleChange}
              required
              className="w-full p-2.5 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="Ví dụ: 10"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              Đơn giá nhập (VNĐ)
            </label>
            <input
              type="number"
              name="DonGiaNhap"
              min="0"
              value={formData.DonGiaNhap}
              onChange={handleChange}
              required
              className="w-full p-2.5 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="Ví dụ: 150000"
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
              disabled={createStockReceipt.isPending}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {createStockReceipt.isPending ? 'Đang xử lý...' : 'Xác nhận nhập kho'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
