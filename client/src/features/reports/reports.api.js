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
  const { data } = await axiosClient.get('/api/v1/reports/repair-report/summary', { params });
  return data.data;
}

export async function exportRepairReport(params) {
  const response = await axiosClient.get('/api/v1/reports/repair-report/summary/export', {
    params,
    responseType: 'blob'
  });
  return response.data;
}

export async function fetchRevenueReport(params) {
  const queryParams = { ...(params ?? {}) };
  delete queryParams.granularity;
  const { data } = await axiosClient.get('/api/v1/reports/revenue/composition', { params: queryParams });
  return data.data;
}

export async function exportRevenueReport(params) {
  const queryParams = { ...(params ?? {}) };
  delete queryParams.granularity;
  const response = await axiosClient.get('/api/v1/reports/revenue/composition/export', {
    params: queryParams,
    responseType: 'blob'
  });
  return response.data;
}
