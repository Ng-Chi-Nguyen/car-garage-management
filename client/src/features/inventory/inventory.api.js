import axiosClient from '../../lib/axiosClient';

export const inventoryApi = {
  getInventory: async (filters) => {
    const response = await axiosClient.get('/api/v1/parts', { params: filters });
    const { parts, pagination } = response.data.data;
    return {
      data: parts.map(part => ({
        id: part.MaVatTu,
        name: part.TenVatTu,
        group: 'Vật tư', // Mock group as parts doesn't have it natively
        unit: part.DonViTinh,
        stock: part.SoLuongTon,
        cost: new Intl.NumberFormat('vi-VN').format(part.GiaVon) + ' đ',
        price: new Intl.NumberFormat('vi-VN').format(part.DonGiaBan) + ' đ',
        status: part.SoLuongTon > 10 ? 'Đủ hàng' : 'Sắp hết',
        statusCode: part.SoLuongTon > 10 ? 'success' : 'error'
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
  createStockReceipt: async (payload) => {
    const response = await axiosClient.post('/api/v1/workflows/stock-receipts', payload);
    return response.data;
  }
};
