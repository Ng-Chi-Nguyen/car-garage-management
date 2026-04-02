import axiosClient from '../../lib/axiosClient.js';

export async function fetchInventoryReport(params) {
  const { data } = await axiosClient.get('/api/v1/reports/inventory/summary', { params });
  return data.data;
}

export async function exportInventoryReport(params) {
  const response = await axiosClient.get('/api/v1/reports/inventory/summary/export', {
    params,
    responseType: 'blob'
  });
  return response.data;
}

export async function fetchRepairReport(params) {
  const { data } = await axiosClient.get('/api/v1/reports/repair/summary', { params });
  return data.data;
}

export async function exportRepairReport(params) {
  const response = await axiosClient.get('/api/v1/reports/repair/summary/export', {
    params,
    responseType: 'blob'
  });
  return response.data;
}

export async function fetchRevenueReport(params) {
  const { data } = await axiosClient.get('/api/v1/reports/revenue/composition', { params });
  return data.data;
}

export async function exportRevenueReport(params) {
  const response = await axiosClient.get('/api/v1/reports/revenue/composition/export', {
    params,
    responseType: 'blob'
  });
  return response.data;
}
