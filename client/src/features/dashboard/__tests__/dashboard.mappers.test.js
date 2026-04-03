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
    assert.strictEqual(vm.kpis.waitingCount, 0);
    assert.strictEqual(vm.kpis.repairingCount, 0);
    assert.strictEqual(vm.kpis.completedCount, 0);
    assert.strictEqual(vm.kpis.avgRevenuePerRepairOrder, 0);
    
    assert.deepStrictEqual(vm.recentOrders, []);
    assert.deepStrictEqual(vm.trendSeries.dates, []);
    assert.deepStrictEqual(vm.trendSeries.revenues, []);
  });

  test('normalizeDashboardData maps envelopes correctly with numbers and links related data', () => {
    const rawData = {
      customers: [
        { MaKH: 1, TenChuXe: 'Nguyen Van A' },
        { MaKH: 2, TenChuXe: 'Tran Thi B' }
      ],
      vehicles: [
        { MaXe: 1, BienSo: '51H-123.45', MaKH: 1, MaHieuXe: 1 },
        { MaXe: 2, BienSo: '29A-678.90', MaKH: 2, MaHieuXe: 2 }
      ],
      repairOrders: [
        { MaPhieuSC: 1, MaXe: 1, NgayTao: '2023-01-01T12:00:00.000Z', TrangThai: 'TiepNhan' },
        { MaPhieuSC: 2, MaXe: 2, NgayTao: '2023-01-02T12:00:00.000Z', TrangThai: 'DangSua' },
        { MaPhieuSC: 3, MaXe: 1, NgayTao: '2023-01-03T12:00:00.000Z', TrangThai: 'HoanTat' }
      ],
      paymentReceipts: [
        { MaPhieuThu: 1, SoTienThu: '1000', NgayThu: '2023-01-01T14:00:00.000Z' },
        { MaPhieuThu: 2, SoTienThu: '500', NgayThu: '2023-01-01T15:00:00.000Z' }
      ],
      customerCount: 10,
      vehicleCount: 15,
      repairOrderCount: 5
    };

    const vm = normalizeDashboardData(rawData);

    assert.strictEqual(vm.kpis.totalCustomers, 10);
    assert.strictEqual(vm.kpis.totalVehicles, 15);
    assert.strictEqual(vm.kpis.totalRepairOrders, 5);
    assert.strictEqual(vm.kpis.totalRevenue, 1500);
    assert.strictEqual(vm.kpis.avgRevenuePerRepairOrder, 300);

    assert.strictEqual(vm.kpis.waitingCount, 1);
    assert.strictEqual(vm.kpis.repairingCount, 1);
    assert.strictEqual(vm.kpis.completedCount, 1);

    assert.strictEqual(vm.recentOrders.length, 3);
    
    // Check linked data
    assert.strictEqual(vm.recentOrders[0].id, 1);
    assert.strictEqual(vm.recentOrders[0].licensePlate, '51H-123.45');
    assert.strictEqual(vm.recentOrders[0].customerName, 'Nguyen Van A');
    assert.strictEqual(vm.recentOrders[0].status, 'TiepNhan');
    
    assert.strictEqual(vm.recentOrders[1].id, 2);
    assert.strictEqual(vm.recentOrders[1].licensePlate, '29A-678.90');
    assert.strictEqual(vm.recentOrders[1].customerName, 'Tran Thi B');

    assert.deepStrictEqual(vm.trendSeries.dates, ['2023-01-01']);
    assert.deepStrictEqual(vm.trendSeries.revenues, [1500]);
  });

  test('owner uses fallback chain including vehicle.KhachHang.TenChuXe', () => {
    const rawData = {
      customers: [], // Empty customer map
      vehicles: [{ MaXe: 1, KhachHang: { TenChuXe: 'Fallback Owner' } }],
      repairOrders: [{ MaPhieuSC: 1, MaXe: 1 }]
    };
    const vm = normalizeDashboardData(rawData);
    assert.strictEqual(vm.recentOrders[0].customerName, 'Fallback Owner');
  });

  test('model uses vehicle.MauXe when present', () => {
    const rawData = {
      vehicles: [{ MaXe: 1, MauXe: 'Red Sedan', HieuXe: { TenHieuXe: 'Toyota' } }],
      repairOrders: [{ MaPhieuSC: 1, MaXe: 1 }]
    };
    const vm = normalizeDashboardData(rawData);
    assert.strictEqual(vm.recentOrders[0].vehicleModel, 'Red Sedan');
  });

  test('fallback label is retained when all sources are absent', () => {
    const rawData = {
      vehicles: [{ MaXe: 1 }],
      repairOrders: [{ MaPhieuSC: 1, MaXe: 1 }]
    };
    const vm = normalizeDashboardData(rawData);
    assert.strictEqual(vm.recentOrders[0].customerName, 'Không rõ');
    assert.strictEqual(vm.recentOrders[0].vehicleModel, 'Không rõ');
  });
});
