// Mock API for now
export const customersApi = {
  getCustomers: async (filters) => {
    // Mock response
    return {
      data: [
        {
          id: '#KH-2940',
          initials: 'NL',
          name: 'Nguyễn Lâm Anh',
          phone: '090 123 4567',
          carsCount: 3,
          carsSummary: '30A-123.45...',
          visitCount: 24,
          totalSpent: '85,400,000đ',
          debt: null,
          rank: 'VIP',
          lastVisit: 'Hôm qua',
          avatarColor: 'primary'
        },
        {
          id: '#KH-1123',
          initials: 'TH',
          name: 'Trần Hoàng Nam',
          phone: '098 765 4321',
          carsCount: 1,
          carsSummary: '30G-987.65',
          visitCount: 5,
          totalSpent: '12,500,000đ',
          debt: '3,200,000đ',
          rank: 'Thân thiết',
          lastVisit: '12 thg 10',
          avatarColor: 'secondary'
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
  getCustomerDetail: async (id) => {
    return {
      id,
      name: 'Nguyễn Lâm Anh',
      phone: '090 123 4567',
      // ... more details
    };
  }
};
