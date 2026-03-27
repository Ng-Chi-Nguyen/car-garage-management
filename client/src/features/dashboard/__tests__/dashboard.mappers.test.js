import { test, describe } from 'node:test';
import assert from 'node:assert';
import { normalizeDashboardData } from '../dashboard.mappers.js';

describe('dashboard.mappers', () => {
  test('normalizeDashboardData handles empty arrays and calculates KPI totals correctly', () => {
    const rawData = {
      customers: [],
      vehicles: [],
      repairOrders: [],
      paymentReceipts: []
    };
    
    const vm = normalizeDashboardData(rawData);
    
    assert.strictEqual(vm.kpis.totalCustomers, 0);
    assert.strictEqual(vm.kpis.totalVehicles, 0);
    assert.strictEqual(vm.kpis.totalRepairOrders, 0);
    assert.strictEqual(vm.kpis.totalRevenue, 0);
    assert.deepStrictEqual(vm.recentOrders, []);
    assert.deepStrictEqual(vm.trendSeries.dates, []);
    assert.deepStrictEqual(vm.trendSeries.revenues, []);
  });

  test('normalizeDashboardData maps envelopes correctly with numbers', () => {
    const rawData = {
      customers: [{ id: 1 }, { id: 2 }],
      vehicles: [{ id: 1 }],
      repairOrders: [
        { id: 1, createdAt: '2023-01-01T12:00:00.000Z', totalAmount: '1000' },
        { id: 2, createdAt: '2023-01-02T12:00:00.000Z', totalAmount: '2000' }
      ],
      paymentReceipts: [
        { id: 1, amount: '1000', createdAt: '2023-01-01T14:00:00.000Z' },
        { id: 2, amount: '500', createdAt: '2023-01-01T15:00:00.000Z' }
      ]
    };
    
    const vm = normalizeDashboardData(rawData);
    
    assert.strictEqual(vm.kpis.totalCustomers, 2);
    assert.strictEqual(vm.kpis.totalVehicles, 1);
    assert.strictEqual(vm.kpis.totalRepairOrders, 2);
    assert.strictEqual(vm.kpis.totalRevenue, 1500); // from paymentReceipts
    
    assert.strictEqual(vm.recentOrders.length, 2);
    assert.strictEqual(vm.recentOrders[0].id, 1);
    
    // Trend points grouped by date
    assert.deepStrictEqual(vm.trendSeries.dates, ['2023-01-01']);
    assert.deepStrictEqual(vm.trendSeries.revenues, [1500]);
  });
});
