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
    
    // Also fetch transaction history if needed, for now just use the part data
    // /api/v1/stock-receipt-details?MaVatTu=id
    const historyResponse = await axiosClient.get('/api/v1/stock-receipt-details', { params: { MaVatTu: id } }).catch(() => ({ data: { data: { stockReceiptDetails: [] } } }));
    
    return {
      id: part.MaVatTu,
      name: part.TenVatTu,
      unit: part.DonViTinh,
      stock: part.SoLuongTon,
      cost: part.GiaVon,
      price: part.DonGiaBan,
      history: historyResponse.data.data.stockReceiptDetails || []
    };
  }
};
