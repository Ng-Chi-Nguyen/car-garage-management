import axiosClient from '../../lib/axiosClient';
import { mapCustomerSummary, mapCustomerStats } from './customers.mappers';

export const customersApi = {
  getCustomers: async (filters) => {
    // Exclude frontend-only params that cause 400 errors from backend validator
    const { rank, sort, ...backendFilters } = filters || {};
    const { data } = await axiosClient.get('/api/v1/customers', { params: backendFilters });
    
    const formattedData = data.data.customers.map(mapCustomerSummary);

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
  },

  getCustomerStats: async (filters) => {
    // We can assume backend has a /api/v1/customers/stats or similar. Wait, let me check the discovery findings.
    // "backend-stats-endpoint--routevalidator-contract: Resolved the server environment blocker... Verified getCustomerStats, customer route stats..."
    const { data } = await axiosClient.get('/api/v1/customers/stats', { params: filters });
    return mapCustomerStats(data.data?.stats ?? {});
  },

  getCustomerSummary: async (query) => {
    const { data } = await axiosClient.get('/api/v1/reports/customer-report/summary', { params: query });
    return data.data;
  }
};
