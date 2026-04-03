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

export const fetchRepairOrder = async (id) => {
  const response = await axiosClient.get(`/api/v1/repair-orders/${id}`);
  return response.data;
};

export const fetchRepairOrderDetails = async (id) => {
  const response = await axiosClient.get(`/api/v1/repair-order-details`, {
    params: { MaPhieuSC: id, limit: 100 }
  });
  return response.data;
};

export const createRepairOrder = async (payload) => {
  const response = await axiosClient.post(`/api/v1/workflows/repair-orders`, payload);
  return response.data;
};

export const updateRepairOrder = async (id, payload) => {
  const response = await axiosClient.put(`/api/v1/repair-orders/${id}`, payload);
  return response.data;
};

export const fetchVehicles = async () => {
  const response = await axiosClient.get(`/api/v1/vehicles`);
  const data = response.data;
  
  if (data?.data?.vehicles) {
    data.data.vehicles = data.data.vehicles.map(v => {
      // Robust flattening/mapping for vehicle brand to avoid React object render crashes
      const brand = v.HieuXe?.TenHieuXe || (typeof v.HieuXe === 'string' ? v.HieuXe : '') || v.TenHieuXe || '';
      return {
        ...v,
        TenHieuXe: brand
      };
    });
  }
  
  return data;
};

export const fetchParts = async () => {
  const response = await axiosClient.get(`/api/v1/parts`);
  return response.data;
};

export const fetchLaborFees = async () => {
  const response = await axiosClient.get(`/api/v1/labor-fees`);
  return response.data;
};

export const createRepairOrderDetail = async (payload) => {
  const response = await axiosClient.post(`/api/v1/repair-order-details`, payload);
  return response.data;
};

export const updateRepairOrderDetail = async (detailId, payload) => {
  const response = await axiosClient.put(`/api/v1/repair-order-details/${detailId}`, payload);
  return response.data;
};

export const deleteRepairOrderDetail = async (detailId) => {
  const response = await axiosClient.delete(`/api/v1/repair-order-details/${detailId}`);
  return response.data;
};
