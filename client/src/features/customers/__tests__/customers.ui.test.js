import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CUSTOMERS_KEYS } from '../customers.queryKeys.js';

describe('Customers Feature Contract', () => {
  it('should define correct query keys', () => {
    assert.deepStrictEqual(CUSTOMERS_KEYS.all, ['customers']);
    assert.deepStrictEqual(CUSTOMERS_KEYS.lists(), ['customers', 'list']);
    assert.deepStrictEqual(CUSTOMERS_KEYS.list({ page: 1 }), ['customers', 'list', { page: 1 }]);
    assert.deepStrictEqual(CUSTOMERS_KEYS.details(), ['customers', 'detail']);
    assert.deepStrictEqual(CUSTOMERS_KEYS.detail('123'), ['customers', 'detail', '123']);
  });
});
