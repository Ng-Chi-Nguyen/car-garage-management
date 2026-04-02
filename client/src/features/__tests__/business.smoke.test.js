import { test, describe } from 'node:test';
import assert from 'node:assert';
import { applyFilterUpdates, getValidStatus, getValidRange, getValidSearch } from '../workshop/workshop.filters.js';
import { SETTINGS_KEYS } from '../settings/settings.queryKeys.js';
import { applyInventoryFilterUpdates, getInventoryFilters } from '../inventory/inventory.filters.js';
import { calculateReceivablesSummary } from '../finance/finance.utils.js';

globalThis.localStorage ??= {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const { default: axiosClient } = await import('../../lib/axiosClient.js');
axiosClient.get = async (url) => {
  if (url === '/api/v1/settings/car-brands') {
    return { data: { data: { carBrands: [{ id: 1, name: 'Toyota', modelCount: 2, description: 'Toyota' }] } } };
  }
  if (url === '/api/v1/activity/logs') {
    return { data: { data: { activityLogs: [
      { id: 'a1', user: 'Nhân viên #1', initials: 'NN', status: 'success', statusLabel: 'Thành công' },
      { id: 'a2', user: 'Hệ thống', initials: 'HT', status: 'error', statusLabel: 'Thất bại' },
    ] } } };
  }
  throw new Error(`Unexpected request: ${url}`);
};

const { fetchCarBrands } = await import('../settings/settings.api.js');
const { fetchActivityLogs } = await import('../activity/activity.api.js');

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

  test('5. Settings catalog shape is stable', async () => {
    const carBrands = await fetchCarBrands();

    assert.ok(Array.isArray(carBrands));
    assert.ok(carBrands.length > 0);
    assert.ok(carBrands.every((brand) => typeof brand.id === 'number' || typeof brand.id === 'string'));
    assert.ok(carBrands.every((brand) => typeof brand.name === 'string'));
    assert.ok(carBrands.every((brand) => typeof brand.modelCount === 'number'));
    assert.deepStrictEqual(
      Object.keys(carBrands[0]).sort(),
      ['description', 'id', 'modelCount', 'name'],
    );
  });

  test('6. Activity log shape is stable', async () => {
    const logs = await fetchActivityLogs();

    assert.ok(Array.isArray(logs));
    assert.ok(logs.length > 0);
    assert.ok(logs.every((log) => typeof log.id === 'string'));
    assert.ok(logs.every((log) => typeof log.user === 'string'));
    assert.ok(logs.every((log) => typeof log.initials === 'string'));
    assert.ok(logs.every((log) => typeof log.status === 'string'));
    assert.ok(logs.every((log) => typeof log.statusLabel === 'string'));
    assert.deepStrictEqual(logs.map((log) => log.id), ['a1', 'a2']);
  });
});
