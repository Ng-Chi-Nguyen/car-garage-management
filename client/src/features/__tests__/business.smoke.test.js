import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 1. repair orders list filter/status/date/search behavior
import { applyFilterUpdates, getValidStatus, getValidRange, getValidSearch } from '../workshop/workshop.filters.js';

// 4. settings actions/config persistence paths
import { SETTINGS_KEYS } from '../settings/settings.queryKeys.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Business Smoke Checklist', () => {

  test('1. Repair orders list filter/status/date/search behavior', () => {
    // Check validation
    assert.strictEqual(getValidStatus('invalid'), 'all');
    assert.strictEqual(getValidStatus('waiting'), 'waiting');
    
    assert.strictEqual(getValidRange('invalid'), '7d');
    assert.strictEqual(getValidRange('today'), 'today');

    assert.strictEqual(getValidSearch('  test  '), 'test');

    // Check application behavior
    const prev = new URLSearchParams('?status=all&page=2');
    const updated = applyFilterUpdates(prev, { status: 'waiting' });
    assert.strictEqual(updated.get('status'), 'waiting');
    assert.strictEqual(updated.get('page'), null, 'Changing status should reset to page 1 (which removes the parameter)');
    
    const updatedSearch = applyFilterUpdates(prev, { search: 'foo' });
    assert.strictEqual(updatedSearch.get('search'), 'foo');
    assert.strictEqual(updatedSearch.get('page'), null);
  });

  test('2. Inventory list search/sort/page behavior', () => {
    // We statically analyze the hook to ensure it handles search and page resetting
    const content = fs.readFileSync(path.join(__dirname, '../inventory/useInventoryFilters.js'), 'utf8');
    
    // Checks that page is reset when search or category changes
    assert.match(content, /if \(newFilters\.search !== undefined && newFilters\.search !== filters\.search && newFilters\.page === undefined\) {/);
    assert.match(content, /params\.delete\('page'\);/);
    
    assert.match(content, /const filters = {/);
    assert.match(content, /search: searchParams\.get\('search'\) \|\| ''/);
    assert.match(content, /page: parseInt\(searchParams\.get\('page'\) \|\| '1', 10\)/);
  });

  test('3. Receivables grouping/totals behavior', () => {
    const content = fs.readFileSync(path.join(__dirname, '../finance/components/ReceivablesForm.jsx'), 'utf8');
    
    // Check that it maps receivableCustomers and calculates length as total vehicles
    assert.match(content, /const totalDebtVehicles = receivableCustomers\.length;/);
    
    // Check that it sums up the debt using reduce
    assert.match(content, /receivableCustomers\.reduce\(\(sum, item\) => sum \+ item\.debt, 0\)/);
    
    // Check that it renders these totals
    assert.match(content, /totalDebtVehicles/);
    assert.match(content, /totalReceivable/);
    assert.match(content, /formatCurrency\(totalReceivable\)/);
  });

  test('4. Settings actions/config persistence paths', () => {
    // Verify that the mutation hook exposes the invalidation contract correctly
    // And uses settings query keys
    const content = fs.readFileSync(path.join(__dirname, '../settings/useSettingsMutation.js'), 'utf8');
    
    // Should invalidate SETTINGS_KEYS
    assert.match(content, /export const INVALIDATES_KEYS = \{/);
    assert.match(content, /SETTINGS_KEYS\.parameters\(\)/);
    assert.match(content, /queryClient\.invalidateQueries\(/);
    
    // Settings query keys verification
    assert.strictEqual(SETTINGS_KEYS.all[0], 'settings');
    assert.strictEqual(SETTINGS_KEYS.parameters()[0], 'settings');
  });
});
