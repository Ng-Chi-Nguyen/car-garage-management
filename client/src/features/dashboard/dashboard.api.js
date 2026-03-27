import axiosClient from '../lib/axiosClient.js';
import { toDateRange } from './dashboard.dateRange.js';
import { normalizeDashboardData } from './dashboard.mappers.js';

export async function fetchDashboardData(rangeType = '7days') {
    const { startDate, endDate } = toDateRange(rangeType);

    // Limit to large number to get mostly all within range or 
    // real implementation might need to sum up differently if data is huge.
    // For V1, we fetch all within range.
    const params = {
        NgayTaoFrom: startDate,
        NgayTaoTo: endDate,
        limit: 1000
    };

    const [
        customersRes,
        vehiclesRes,
        repairOrdersRes,
        paymentReceiptsRes
    ] = await Promise.all([
        axiosClient.get('/api/v1/customers', { params }),
        axiosClient.get('/api/v1/vehicles', { params }),
        axiosClient.get('/api/v1/repair-orders', { params }),
        axiosClient.get('/api/v1/payment-receipts', { params })
    ]);

    const rawData = {
        customers: customersRes.data?.data?.customers || [],
        vehicles: vehiclesRes.data?.data?.vehicles || [],
        repairOrders: repairOrdersRes.data?.data?.repairOrders || [],
        paymentReceipts: paymentReceiptsRes.data?.data?.paymentReceipts || []
    };

    return normalizeDashboardData(rawData);
}
