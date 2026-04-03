import axiosClient from '../../lib/axiosClient.js';
import { sanitizeInventoryFilters } from './inventory.filters.js';

export const LOW_STOCK_THRESHOLD = 5;

export const mapStockStatus = (stock) => {
  if (stock <= 0) {
    return { status: 'Hết hàng', statusCode: 'error' };
  }

  if (stock <= LOW_STOCK_THRESHOLD) {
    return { status: 'Sắp hết', statusCode: 'warning' };
  }

  return { status: 'Còn hàng', statusCode: 'success' };
};

export const inventoryApi = {
  getInventory: async (filters) => {
    const backendFilters = sanitizeInventoryFilters(filters);
    const response = await axiosClient.get('/api/v1/parts', { params: backendFilters });
    const { parts, pagination } = response.data.data;
    return {
      data: parts.map(part => ({
        id: part.MaVatTu,
        name: part.TenVatTu,
        supplierId: part.MaNCC,
        supplier: part.NhaCungCap?.TenNCC || 'Chưa xác định',
        unit: part.DonViTinh,
        stock: part.SoLuongTon,
        costValue: part.GiaVon,
        cost: new Intl.NumberFormat('vi-VN').format(part.GiaVon) + ' đ',
        priceValue: part.DonGiaBan,
        price: new Intl.NumberFormat('vi-VN').format(part.DonGiaBan) + ' đ',
        ...mapStockStatus(Number(part.SoLuongTon ?? 0)),
      })),
      pagination
    };
  },
  getStockDetail: async (id) => {
    const response = await axiosClient.get(`/api/v1/parts/${id}`);
    const part = response.data.data.part;

    const historyResponse = await axiosClient.get('/api/v1/stock-receipt-details', { params: { MaVatTu: id } });

    return {
      id: part.MaVatTu,
      name: part.TenVatTu,
      unit: part.DonViTinh,
      stock: part.SoLuongTon,
      cost: part.GiaVon,
      price: part.DonGiaBan,
      history: historyResponse.data.data.stockReceiptDetails || []
    };
  },
  getSuppliers: async () => {
    const response = await axiosClient.get('/api/v1/suppliers', { params: { limit: 100 } });
    return response.data.data.suppliers || [];
  },
  createPart: async (payload) => {
    const response = await axiosClient.post('/api/v1/parts', payload);
    return response.data;
  },
  updatePart: async (id, payload) => {
    const response = await axiosClient.put(`/api/v1/parts/${id}`, payload);
    return response.data;
  },
  deletePart: async (id) => {
    const response = await axiosClient.delete(`/api/v1/parts/${id}`);
    return response.data;
  },
  createSupplier: async (payload) => {
    const response = await axiosClient.post('/api/v1/suppliers', payload);
    return response.data;
  },
  createStockReceipt: async (payload) => {
    const response = await axiosClient.post('/api/v1/workflows/stock-receipts', payload);
    return response.data;
  }
};
