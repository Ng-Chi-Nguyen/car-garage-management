import { describe, it } from 'node:test';
import assert from 'node:assert';
import { INVENTORY_KEYS, SUPPLIER_KEYS } from '../inventory.queryKeys.js';
import { getInventoryFilters, sanitizeInventoryFilters } from '../inventory.filters.js';
import { LOW_STOCK_THRESHOLD, mapStockStatus } from '../inventory.api.js';
import { REPORT_INVENTORY_KEY_PREFIX } from '../useInventoryMutations.js';

describe('Inventory Feature Contract', () => {
  it('should define correct query keys', () => {
    assert.deepStrictEqual(INVENTORY_KEYS.all, ['inventory']);
    assert.deepStrictEqual(INVENTORY_KEYS.lists(), ['inventory', 'list']);
    assert.deepStrictEqual(INVENTORY_KEYS.list({ page: 1 }), ['inventory', 'list', { page: 1 }]);
    assert.deepStrictEqual(INVENTORY_KEYS.details(), ['inventory', 'detail']);
    assert.deepStrictEqual(INVENTORY_KEYS.detail('123'), ['inventory', 'detail', '123']);
    assert.deepStrictEqual(SUPPLIER_KEYS.all, ['suppliers']);
    assert.deepStrictEqual(SUPPLIER_KEYS.lists(), ['suppliers', 'list']);
    assert.deepStrictEqual(SUPPLIER_KEYS.list({ limit: 100 }), ['suppliers', 'list', { limit: 100 }]);
    assert.deepStrictEqual(SUPPLIER_KEYS.details(), ['suppliers', 'detail']);
    assert.deepStrictEqual(SUPPLIER_KEYS.detail('abc'), ['suppliers', 'detail', 'abc']);
  });

  it('should sanitize inventory filters safely', () => {
    assert.deepStrictEqual(
      sanitizeInventoryFilters({
        search: '  bugi  ',
        stockStatus: '',
        note: '   ',
        page: 1,
        includeArchived: false,
        minQty: 0,
        supplier: null,
      }),
      {
        search: 'bugi',
        page: 1,
        includeArchived: false,
        minQty: 0,
      }
    );
  });

  it('should parse inventory filters safely from URL params', () => {
    assert.deepStrictEqual(
      getInventoryFilters(new URLSearchParams('search=loc&stockStatus=invalid&page=0')),
      {
        search: 'loc',
        stockStatus: undefined,
        page: 1,
      }
    );

    assert.deepStrictEqual(
      getInventoryFilters(new URLSearchParams('search=loc&stockStatus=low&page=3')),
      {
        search: 'loc',
        stockStatus: 'low',
        page: 3,
      }
    );
  });

  it('should build query key from sanitized filters', () => {
    assert.deepStrictEqual(
      INVENTORY_KEYS.list({ search: '  loc  ', stockStatus: '   ', page: 1 }),
      ['inventory', 'list', { search: 'loc', page: 1 }]
    );
  });

  it('should map low stock status using backend threshold', () => {
    assert.equal(LOW_STOCK_THRESHOLD, 5);
    assert.deepStrictEqual(mapStockStatus(0), { status: 'Hết hàng', statusCode: 'error' });
    assert.deepStrictEqual(mapStockStatus(5), { status: 'Sắp hết', statusCode: 'warning' });
    assert.deepStrictEqual(mapStockStatus(6), { status: 'Còn hàng', statusCode: 'success' });
  });

  it('should target inventory report query prefix for invalidation', () => {
    assert.deepStrictEqual(REPORT_INVENTORY_KEY_PREFIX, ['reports', 'inventory']);
  });
});
