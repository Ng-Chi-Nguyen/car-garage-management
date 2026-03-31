import { test, describe } from 'node:test';
import assert from 'node:assert';
import { applyFilterUpdates, getValidStatus, getValidRange, getValidSearch } from '../workshop/workshop.filters.js';
import { SETTINGS_KEYS } from '../settings/settings.queryKeys.js';
import { applyInventoryFilterUpdates, getInventoryFilters } from '../inventory/inventory.filters.js';
import { calculateReceivablesSummary } from '../finance/finance.utils.js';

describe('Business Smoke Checklist', () => {

  test('1. Repair orders list filter/status/date/search behavior', () => {
    assert.strictEqual(getValidStatus('invalid'), 'all');
    assert.strictEqual(getValidStatus('waiting'), 'waiting');

    assert.strictEqual(getValidRange('invalid'), '7d');
    assert.strictEqual(getValidRange('today'), 'today');

    assert.strictEqual(getValidSearch('  test  '), 'test');

    const prev = new URLSearchParams('?status=all&page=2');
    const updated = applyFilterUpdates(prev, { status: 'waiting' });
    assert.strictEqual(updated.get('status'), 'waiting');
    assert.strictEqual(updated.get('page'), null, 'Changing status should reset to page 1');
  });

  test('2. Inventory list search/sort/page behavior', () => {
    const prev = new URLSearchParams('?search=oil&page=3');
    const filters = getInventoryFilters(prev);
    assert.strictEqual(filters.search, 'oil');
    assert.strictEqual(filters.page, 3);
    assert.strictEqual(filters.category, 'all');

    const updatedSearch = applyInventoryFilterUpdates(prev, { search: 'brake' });
    assert.strictEqual(updatedSearch.get('search'), 'brake');
    assert.strictEqual(updatedSearch.get('page'), null, 'Changing search should reset to page 1');
  });

  test('3. Receivables grouping/totals behavior', () => {
    const mockCustomers = [
      { name: 'A', debt: 1500000 },
      { name: 'B', debt: 500000 }
    ];
    const { totalDebtVehicles, totalReceivable } = calculateReceivablesSummary(mockCustomers);
    assert.strictEqual(totalDebtVehicles, 2);
    assert.strictEqual(totalReceivable, 2000000);
  });

  test('4. Settings actions/config persistence paths', () => {
    assert.strictEqual(SETTINGS_KEYS.all[0], 'settings');
    assert.strictEqual(SETTINGS_KEYS.parameters()[0], 'settings');
  });
});
