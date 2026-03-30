import axiosClient from '../../lib/axiosClient.js';
import { toDateRange } from './dashboard.dateRange.js';
import { normalizeDashboardData } from './dashboard.mappers.js';

const DASHBOARD_LIMIT = 2000;

export async function fetchDashboardData(rangeType = '7d') {
    const { startDate, endDate } = toDateRange(rangeType);

    const params = {
        NgayTaoFrom: startDate,
        NgayTaoTo: endDate,
        limit: DASHBOARD_LIMIT,
    };

    const results = await Promise.allSettled([
        axiosClient.get('/api/v1/customers', { params }),
        axiosClient.get('/api/v1/vehicles', { params: { limit: DASHBOARD_LIMIT } }), // Vehicles do not support NgayTao filter
        axiosClient.get('/api/v1/repair-orders', { params }),
        axiosClient.get('/api/v1/payment-receipts', { 
            params: { NgayThuFrom: startDate, NgayThuTo: endDate, limit: DASHBOARD_LIMIT }
        })
    ]);

    const getSuccessData = (res, key) => 
        res.status === 'fulfilled' ? res.value?.data?.data?.[key] || [] : [];

    const getPaginationCount = (res) =>
        res.status === 'fulfilled' ? res.value?.data?.data?.pagination?.totalItems : undefined;

    const rawData = {
        customers: getSuccessData(results[0], 'customers'),
        vehicles: getSuccessData(results[1], 'vehicles'),
        repairOrders: getSuccessData(results[2], 'repairOrders'),
        paymentReceipts: getSuccessData(results[3], 'paymentReceipts'),
        customerCount: getPaginationCount(results[0]),
        vehicleCount: getPaginationCount(results[1]),
        repairOrderCount: getPaginationCount(results[2])
    };

    return normalizeDashboardData(rawData);
}
