import axiosClient from '../../lib/axiosClient';

export const fetchRepairOrders = async ({ page = 1, limit = 10, search = '' }) => {
  const params = {
    page,
    limit,
    ...(search && { search })
  };

  const response = await axiosClient.get(`/api/v1/repair-orders`, { params });
  return response.data;
};

export const createRepairOrder = async (payload) => {
  const response = await axiosClient.post(`/api/v1/workflows/repair-orders`, payload);
  return response.data;
};

export const fetchVehicles = async () => {
  const response = await axiosClient.get(`/api/v1/vehicles`);
  return response.data;
};

export const fetchParts = async () => {
  const response = await axiosClient.get(`/api/v1/parts`);
  return response.data;
};

export const fetchLaborFees = async () => {
  const response = await axiosClient.get(`/api/v1/labor-fees`);
  return response.data;
};
