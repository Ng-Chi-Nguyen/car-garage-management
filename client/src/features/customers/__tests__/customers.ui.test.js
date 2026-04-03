import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CUSTOMERS_KEYS } from '../customers.queryKeys.js';
import { mapCustomerSummary, mapCustomerStats } from '../customers.mappers.js';
import { serializeFilters, deserializeFilters } from '../customers.filters.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const customersListPath = path.join(__dirname, '../components/CustomersList.jsx');

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
      totalOutstandingDebt: 5000000,
      monthlyRepairOrders: 50
    };
    const result = mapCustomerStats(raw);
    assert.strictEqual(result.totalCustomers, 100);
    assert.strictEqual(result.vipCustomers, 10);
    assert.strictEqual(result.totalOutstandingDebt, '5.000.000\xa0₫');
    assert.strictEqual(result.monthlyRepairOrders, 50);
  });
});

describe('Customers Filters and UI Contracts', () => {
  describe('customers.filters.js helpers', () => {
    it('serializes advanced filters', () => {
      const filters = { search: 'A', page: 2 };
      const searchParams = serializeFilters(filters);
      assert.strictEqual(searchParams.get('search'), 'A');
      assert.strictEqual(searchParams.get('page'), '2');
    });

    it('resets page on filter change', () => {
      const currentFilters = { search: 'A', page: 2 };
      const newFilters = { search: 'B' }; // search changed, should reset page
      const searchParams = serializeFilters(newFilters, currentFilters);
      assert.strictEqual(searchParams.get('search'), 'B');
      assert.strictEqual(searchParams.has('page'), false); // or '1'
    });
  });

  describe('CustomersList UI Contracts', () => {
    const content = fs.readFileSync(customersListPath, 'utf-8');

    it('CustomersList uses form onSubmit for advanced filter', () => {
      assert.ok(content.includes('<form'), 'Must use form element');
      assert.ok(content.includes('onSubmit='), 'Must use onSubmit handler');
    });

    it('CustomersList has no rank/sort controls', () => {
      assert.ok(!content.includes('value={filters.rank}'), 'Should not have rank control');
      assert.ok(!content.includes('value={filters.sort}'), 'Should not have sort control');
    });

    it('Xe quan ly column renders count only', () => {
      assert.ok(content.includes('{customer.carsCount} xe'), 'Should render carsCount xe');
      assert.ok(!content.includes('customer.carsSummary'), 'Should not render carsSummary');
    });
  });
});
