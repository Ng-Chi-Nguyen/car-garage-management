import axiosClient from '../../lib/axiosClient.js';
import { normalizeWorkshopData } from './workshop.mappers.js';

const WORKSHOP_LIMIT = 2000;

export async function fetchWorkshopData() {
    const params = {
        limit: WORKSHOP_LIMIT,
    };

    const results = await Promise.allSettled([
        axiosClient.get('/api/v1/vehicles', { params }),
        axiosClient.get('/api/v1/repair-orders', { params })
    ]);

    const getSuccessData = (res, key) => 
        res.status === 'fulfilled' ? res.value?.data?.data?.[key] || [] : [];

    const rawData = {
        vehicles: getSuccessData(results[0], 'vehicles'),
        repairOrders: getSuccessData(results[1], 'repairOrders')
    };

    return normalizeWorkshopData(rawData);
}
