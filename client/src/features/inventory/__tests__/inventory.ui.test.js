import { describe, it } from 'node:test';
import assert from 'node:assert';
import { INVENTORY_KEYS } from '../inventory.queryKeys.js';
import { sanitizeInventoryFilters } from '../inventory.filters.js';

describe('Inventory Feature Contract', () => {
  it('should define correct query keys', () => {
    assert.deepStrictEqual(INVENTORY_KEYS.all, ['inventory']);
    assert.deepStrictEqual(INVENTORY_KEYS.lists(), ['inventory', 'list']);
    assert.deepStrictEqual(INVENTORY_KEYS.list({ page: 1 }), ['inventory', 'list', { page: 1 }]);
    assert.deepStrictEqual(INVENTORY_KEYS.details(), ['inventory', 'detail']);
    assert.deepStrictEqual(INVENTORY_KEYS.detail('123'), ['inventory', 'detail', '123']);
  });

  it('should sanitize inventory filters safely', () => {
    assert.deepStrictEqual(
      sanitizeInventoryFilters({
        search: '  bugi  ',
        stockStatus: '',
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

  it('should build query key from sanitized filters', () => {
    assert.deepStrictEqual(
      INVENTORY_KEYS.list({ search: '  loc  ', stockStatus: '   ', page: 1 }),
      ['inventory', 'list', { search: 'loc', page: 1 }]
    );
  });
});
