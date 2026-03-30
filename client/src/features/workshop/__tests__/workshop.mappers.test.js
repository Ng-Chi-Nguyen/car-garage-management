import { describe, it } from 'node:test';
import assert from 'node:assert';
import { normalizeWorkshopData } from '../workshop.mappers.js';

describe('normalizeWorkshopData', () => {
  it('should return default structure for empty inputs', () => {
    const result = normalizeWorkshopData({});
    assert.deepStrictEqual(result.metrics, { waiting: 0, in_progress: 0, completed: 0, total: 0 });
    assert.deepStrictEqual(result.activeRows, []);
  });

  it('should correctly count statuses and map to waiting/in_progress/completed', () => {
    const repairOrders = [
      { MaPhieuSC: 1, TrangThai: 'TiepNhan' },
      { MaPhieuSC: 2, TrangThai: 'DangSua' },
      { MaPhieuSC: 3, TrangThai: 'HoanTat' },
      { MaPhieuSC: 4, TrangThai: 'Huy' },
      { MaPhieuSC: 5, TrangThai: null },
      { MaPhieuSC: 6, TrangThai: 'UnknownStatus' }
    ];
    
    const result = normalizeWorkshopData({ repairOrders });
    
    assert.strictEqual(result.metrics.waiting, 3); // 1 TiepNhan + 2 unknown
    assert.strictEqual(result.metrics.in_progress, 1);
    assert.strictEqual(result.metrics.completed, 2); // HoanTat + Huy
    assert.strictEqual(result.metrics.total, 6);
  });

  it('should map active rows with correct badge tokens and deterministic time mapping', () => {
    const repairOrders = [
      { MaPhieuSC: 1, TrangThai: 'TiepNhan', NgaySC: '2023-01-01T10:00:00Z', NgayTao: '2023-01-01T09:00:00Z', MaXe: 'X1' },
      { MaPhieuSC: 2, TrangThai: 'DangSua', NgaySC: null, NgayTao: '2023-01-02T10:00:00Z', MaXe: 'X2' },
      { MaPhieuSC: 3, TrangThai: 'HoanTat', NgaySC: 'invalid-date', NgayTao: 'invalid-date', MaXe: 'X3' }
    ];

    const vehicles = [
      { MaXe: 'X1', BienSo: '51F-12345', TenHieuXe: 'Toyota' },
      { MaXe: 'X2', BienSo: '51F-67890', HieuXe: { TenHieuXe: 'Honda' } },
      { MaXe: 'X3', BienSo: '51F-99999' }
    ];

    const result = normalizeWorkshopData({ repairOrders, vehicles });

    assert.strictEqual(result.activeRows.length, 3);

    // Row 1: TiepNhan -> waiting, secondary. Time = NgaySC
    assert.strictEqual(result.activeRows[0].status.id, 'waiting');
    assert.strictEqual(result.activeRows[0].status.badge, 'secondary');
    assert.strictEqual(result.activeRows[0].time, '2023-01-01T10:00:00Z');
    assert.strictEqual(result.activeRows[0].licensePlate, '51F-12345');
    assert.strictEqual(result.activeRows[0].carId, 'X1');
    assert.strictEqual(result.activeRows[0].brand, 'Toyota');

    // Row 2: DangSua -> in_progress, primary. Time = NgayTao
    assert.strictEqual(result.activeRows[1].status.id, 'in_progress');
    assert.strictEqual(result.activeRows[1].status.badge, 'primary');
    assert.strictEqual(result.activeRows[1].time, '2023-01-02T10:00:00Z');
    assert.strictEqual(result.activeRows[1].carId, 'X2');
    assert.strictEqual(result.activeRows[1].brand, 'Honda');
    
    // Row 3: invalid time -> "-"
    assert.strictEqual(result.activeRows[2].time, '-');
    assert.strictEqual(result.activeRows[2].carId, 'X3');
    assert.strictEqual(result.activeRows[2].brand, '');
  });
});
