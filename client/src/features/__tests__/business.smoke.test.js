import { test, describe } from 'node:test';
import assert from 'node:assert';
import { applyFilterUpdates, getValidStatus, getValidRange, getValidSearch } from '../workshop/workshop.filters.js';
import { SETTINGS_KEYS } from '../settings/settings.queryKeys.js';
import { applyInventoryFilterUpdates, getInventoryFilters } from '../inventory/inventory.filters.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculateReceivablesSummary } from '../finance/finance.utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    assert.strictEqual(filters.stockStatus, '');

    const updatedSearch = applyInventoryFilterUpdates(prev, { search: 'brake' });
    assert.strictEqual(updatedSearch.get('search'), 'brake');
    assert.strictEqual(updatedSearch.get('page'), null, 'Changing search should reset to page 1');

    const prevWithStockStatus = new URLSearchParams('?stockStatus=low&page=4');
    const updatedStockStatus = applyInventoryFilterUpdates(prevWithStockStatus, { stockStatus: 'out_of_stock' });
    assert.strictEqual(updatedStockStatus.get('stockStatus'), 'out_of_stock');
    assert.strictEqual(updatedStockStatus.get('page'), null, 'Changing stockStatus should reset to page 1');

    const unchangedStockStatus = applyInventoryFilterUpdates(prevWithStockStatus, { stockStatus: 'low' });
    assert.strictEqual(unchangedStockStatus.get('stockStatus'), 'low');
    assert.strictEqual(unchangedStockStatus.get('page'), '4', 'Keeping stockStatus should preserve current page');
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

  test('5. Settings catalog contract remains explicit', () => {
    const source = fs.readFileSync(path.join(__dirname, '../settings/__tests__/settings.ui.test.js'), 'utf8');

    assert.match(source, /fetchSystemParameters/);
    assert.match(source, /maxCarsPerDay/);
    assert.match(source, /materialProfitMargin/);
  });

  test('6. Activity log contract remains explicit', () => {
    const source = fs.readFileSync(path.join(__dirname, '../activity/__tests__/activity.ui.test.js'), 'utf8');

    assert.match(source, /fetchActivityLogs/);
    assert.match(source, /initials/);
    assert.match(source, /statusLabel/);
  });

  test('7. Inventory list returns normalized stock fields', async () => {
    const source = fs.readFileSync(path.join(__dirname, '../inventory/inventory.api.js'), 'utf8');

    assert.match(source, /getInventory: async \(filters\) => {/);
    assert.match(source, /const \{ parts, pagination \} = response\.data\.data;/);
    assert.match(source, /id: part\.MaVatTu,/);
    assert.match(source, /stock: part\.SoLuongTon,/);
  });
});
