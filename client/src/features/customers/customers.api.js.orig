import axiosClient from '../../lib/axiosClient';

function formatCurrency(amount) {
  if (!amount && amount !== 0) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export const customersApi = {
  getCustomers: async (filters) => {
    const { data } = await axiosClient.get('/api/v1/customers', { params: filters });
    
    const formattedData = data.data.customers.map(c => {
      let visitCount = 0;
      let totalSpent = 0;
      let totalDebt = 0;
      let lastVisitDate = null;
      let carsSummary = [];

      (c.Xe || []).forEach(xe => {
        carsSummary.push(xe.BienSo);
        totalDebt += Number(xe.TienNoHienTai || 0);
        
        (xe.PhieuSuaChua || []).forEach(phieu => {
          visitCount++;
          totalSpent += Number(phieu.TongTien || 0);
          
          const phieuDate = new Date(phieu.NgaySC || phieu.NgayTao);
          if (!lastVisitDate || phieuDate > lastVisitDate) {
            lastVisitDate = phieuDate;
          }
        });
      });

      return {
        id: c.MaKH,
        rawId: c.MaKH, // useful for linking
        initials: c.TenChuXe ? c.TenChuXe.split(' ').pop().substring(0, 2).toUpperCase() : 'KH',
        name: c.TenChuXe,
        phone: c.DienThoai,
        email: c.Email,
        carsCount: c.Xe?.length || 0,
        carsSummary: carsSummary.length > 0 ? (carsSummary.length > 1 ? `${carsSummary[0]}...` : carsSummary[0]) : 'Chưa có xe',
        visitCount,
        totalSpent: formatCurrency(totalSpent),
        debt: totalDebt > 0 ? formatCurrency(totalDebt) : null,
        rank: totalSpent > 50000000 ? 'VIP' : totalSpent > 10000000 ? 'Thân thiết' : totalSpent > 0 ? 'Thường xuyên' : 'Mới',
        lastVisit: lastVisitDate ? lastVisitDate.toLocaleDateString('vi-VN') : 'Chưa có',
        avatarColor: ['primary', 'secondary', 'tertiary', 'error'][c.MaKH % 4]
      };
    });

    return {
      data: formattedData,
      pagination: data.data.pagination
    };
  },
  
  getCustomerDetail: async (id) => {
    const { data } = await axiosClient.get(`/api/v1/customers/${id}`);
    const c = data.data.customer;
    
    let visitCount = 0;
    let totalSpent = 0;
    let totalDebt = 0;
    let lastVisitDate = null;
    let carsSummary = [];

    (c.Xe || []).forEach(xe => {
      carsSummary.push(xe.BienSo);
      totalDebt += Number(xe.TienNoHienTai || 0);
      
      (xe.PhieuSuaChua || []).forEach(phieu => {
        visitCount++;
        totalSpent += Number(phieu.TongTien || 0);
        
        const phieuDate = new Date(phieu.NgaySC || phieu.NgayTao);
        if (!lastVisitDate || phieuDate > lastVisitDate) {
          lastVisitDate = phieuDate;
        }
      });
    });

    return {
      ...c, // keep original details
      id: c.MaKH,
      name: c.TenChuXe,
      phone: c.DienThoai,
      email: c.Email,
      address: c.DiaChi,
      carsCount: c.Xe?.length || 0,
      visitCount,
      totalSpent,
      totalDebt,
      rank: totalSpent > 50000000 ? 'VIP' : totalSpent > 10000000 ? 'Thân thiết' : totalSpent > 0 ? 'Thường xuyên' : 'Mới',
      lastVisit: lastVisitDate ? lastVisitDate.toLocaleDateString('vi-VN') : 'Chưa có',
      initials: c.TenChuXe ? c.TenChuXe.split(' ').pop().substring(0, 2).toUpperCase() : 'KH',
      avatarColor: ['primary', 'secondary', 'tertiary', 'error'][c.MaKH % 4]
    };
  },
  
  createCustomer: async (customerData) => {
    const formData = new FormData();
    Object.keys(customerData).forEach(key => {
      if (customerData[key] !== undefined && customerData[key] !== null) {
        formData.append(key, customerData[key]);
      }
    });

    const { data } = await axiosClient.post('/api/v1/customers', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data.data.customer;
  },
  
  updateCustomer: async (id, customerData) => {
    const formData = new FormData();
    Object.keys(customerData).forEach(key => {
      if (customerData[key] !== undefined && customerData[key] !== null) {
        formData.append(key, customerData[key]);
      }
    });

    const { data } = await axiosClient.put(`/api/v1/customers/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data.data.customer;
  }
};
