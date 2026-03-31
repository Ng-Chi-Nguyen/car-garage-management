import { describe, it } from 'node:test';
import assert from 'node:assert';
import { INVENTORY_KEYS } from '../inventory.queryKeys.js';

describe('Inventory Feature Contract', () => {
  it('should define correct query keys', () => {
    assert.deepStrictEqual(INVENTORY_KEYS.all, ['inventory']);
    assert.deepStrictEqual(INVENTORY_KEYS.lists(), ['inventory', 'list']);
    assert.deepStrictEqual(INVENTORY_KEYS.list({ page: 1 }), ['inventory', 'list', { page: 1 }]);
    assert.deepStrictEqual(INVENTORY_KEYS.details(), ['inventory', 'detail']);
    assert.deepStrictEqual(INVENTORY_KEYS.detail('123'), ['inventory', 'detail', '123']);
  });
});
