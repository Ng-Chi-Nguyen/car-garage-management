import axiosClient from '../../lib/axiosClient.js';
import { normalizeWorkshopData } from './workshop.mappers.js';

export async function fetchWorkshopData(filters = {}) {
    const { page = 1, limit = 10, status, search } = filters;
    
    const repairOrderParams = {
        page,
        limit,
        search,
    };

    if (status === 'waiting') {
        repairOrderParams.TrangThai = 'TiepNhan';
    } else if (status === 'in_progress') {
        repairOrderParams.TrangThai = 'DangSua';
    } else if (status === 'completed') {
        repairOrderParams.TrangThai = ['HoanTat', 'Huy'];
    }

    const roResponse = await axiosClient.get('/api/v1/repair-orders', { params: repairOrderParams });
    const repairOrders = roResponse.data?.data?.repairOrders || [];
    const pagination = roResponse.data?.data?.pagination || { page: 1, limit: 10, totalItems: 0, totalPages: 0 };

    const vehicleIds = [...new Set(repairOrders.map(ro => ro.MaXe).filter(Boolean))];
    
    let vehicles = [];
    if (vehicleIds.length > 0) {
        const vehiclePromises = vehicleIds.map(id => axiosClient.get(`/api/v1/vehicles/${id}`).catch(() => null));
        const vehicleResults = await Promise.all(vehiclePromises);
        vehicles = vehicleResults
            .filter(res => res && res.data?.data)
            .map(res => res.data.data);
    }

    const rawData = {
        vehicles,
        repairOrders,
        pagination
    };

    return normalizeWorkshopData(rawData);
}
