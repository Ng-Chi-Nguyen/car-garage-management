import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CUSTOMERS_KEYS } from '../customers.queryKeys.js';
import { mapCustomerSummary, mapCustomerStats } from '../customers.mappers.js';

describe('Customers Feature Contract', () => {
  it('should define correct query keys', () => {
    assert.deepStrictEqual(CUSTOMERS_KEYS.all, ['customers']);
    assert.deepStrictEqual(CUSTOMERS_KEYS.lists(), ['customers', 'list']);
    assert.deepStrictEqual(CUSTOMERS_KEYS.list({ page: 1 }), ['customers', 'list', { page: 1 }]);
    assert.deepStrictEqual(CUSTOMERS_KEYS.details(), ['customers', 'detail']);
    assert.deepStrictEqual(CUSTOMERS_KEYS.detail('123'), ['customers', 'detail', '123']);
  });

  it('builds stats query key', () => {
    assert.deepStrictEqual(CUSTOMERS_KEYS.stats({ month: 1 }), ['customers', 'stats', { month: 1 }]);
    assert.deepStrictEqual(CUSTOMERS_KEYS.stats(), ['customers', 'stats', {}]);
  });
});

describe('Customers Mappers', () => {
  it('maps customer summary', () => {
    const raw = {
      MaKH: 1,
      TenChuXe: 'Nguyen Van A',
      DienThoai: '0123456789',
      Email: 'a@example.com',
      Xe: [
        {
          BienSo: '51A-12345',
          TienNoHienTai: 1000000,
          PhieuSuaChua: [
            { TongTien: 5000000, NgaySC: '2023-01-01' }
          ]
        }
      ]
    };
    const result = mapCustomerSummary(raw);
    assert.strictEqual(result.id, 1);
    assert.strictEqual(result.name, 'Nguyen Van A');
    assert.strictEqual(result.initials, 'A');
    assert.strictEqual(result.debt, '1.000.000\xa0₫');
    assert.strictEqual(result.totalSpent, '5.000.000\xa0₫');
  });

  it('maps customer stats', () => {
    const raw = {
      totalCustomers: 100,
      vipCustomers: 10,
      totalDebt: 5000000,
      repairVisits: 50
    };
    const result = mapCustomerStats(raw);
    assert.strictEqual(result.totalCustomers, 100);
    assert.strictEqual(result.vipCustomers, 10);
    assert.strictEqual(result.totalDebt, '5.000.000\xa0₫');
    assert.strictEqual(result.repairVisits, 50);
  });
});
