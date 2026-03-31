export const inventoryApi = {
  getInventory: async (filters) => {
    return {
      data: [
        {
          id: 'VT-00921',
          name: 'Dầu nhớt Castrol Power1 10W-40',
          group: 'Dầu nhớt & Phụ gia',
          unit: 'Chai 1L',
          stock: 142,
          cost: '125,000',
          price: '185,000',
          status: 'Đủ hàng',
          statusCode: 'success'
        },
        {
          id: 'VT-00922',
          name: 'Bugi NGK Iridium CPR8EAIX-9',
          group: 'Điện & Đánh lửa',
          unit: 'Cái',
          stock: 5,
          cost: '225,000',
          price: '285,000',
          status: 'Sắp hết',
          statusCode: 'error'
        }
      ],
      pagination: {
        page: filters.page || 1,
        limit: 10,
        total: 1284,
        totalPages: 129
      }
    };
  },
  getStockDetail: async (id) => {
    return {
      id,
      name: 'Dầu nhớt Castrol Power1 10W-40',
      group: 'Dầu nhớt & Phụ gia'
    };
  }
};
