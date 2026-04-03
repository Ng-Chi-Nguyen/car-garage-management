import test from 'node:test';
import assert from 'node:assert';
import { normalizeWorkshopData } from '../workshop.mappers.js';

test('workshop mappers contract', async (t) => {
  await t.test('mapper exposes brand, model, customerName and hides technician', () => {
    const rawData = {
      repairOrders: [
        {
          MaPhieuSC: 1,
          MaXe: 100,
          TrangThai: 'TiepNhan',
          NguoiSuaChua: 'KTV test'
        }
      ],
      vehicles: [
        {
          MaXe: 100,
          HieuXe: { TenHieuXe: 'Toyota' },
          KhachHang: { TenChuXe: 'Nguyen Van A' },
          MauXe: 'Camry'
        }
      ]
    };
    
    const result = normalizeWorkshopData(rawData);
    const row = result.activeRows[0];
    
    assert.strictEqual(row.brand, 'Toyota');
    assert.strictEqual(row.model, 'Camry');
    assert.strictEqual(row.customerName, 'Nguyen Van A');
    assert.strictEqual(row.technician, undefined);
  });

  await t.test('status Huy maps to bucket completed', () => {
    const rawData = {
      repairOrders: [
        {
          MaPhieuSC: 2,
          TrangThai: 'Huy'
        }
      ]
    };
    
    const result = normalizeWorkshopData(rawData);
    const row = result.activeRows[0];
    
    assert.strictEqual(row.status.id, 'completed');
  });
});
