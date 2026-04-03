import test from 'node:test';
import assert from 'node:assert';
import { applyFilterUpdates } from '../workshop.filters.js';

test('workshop filters update behavior', async (t) => {
  await t.test('filter update resets page=1 when changing status or search', () => {
    const prevParams = new URLSearchParams('page=3&status=waiting');
    
    const nextStatus = applyFilterUpdates(prevParams, { status: 'completed' });
    assert.strictEqual(nextStatus.get('page'), null, 'page should be deleted if 1, meaning it reset to 1');
    
    const prevParamsSearch = new URLSearchParams('page=2');
    const nextSearch = applyFilterUpdates(prevParamsSearch, { search: 'foo' });
    assert.strictEqual(nextSearch.get('page'), null, 'page should be deleted if 1, meaning it reset to 1');
  });
});
