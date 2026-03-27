import { test } from 'node:test';
import assert from 'node:assert';
import { DASHBOARD_QUICK_ACTIONS } from '../dashboard.quickActions.js';

test('dashboard quick actions routes exactly match expected paths', () => {
  const expectedPaths = [
    '/intake/new',
    '/repair-orders/new',
    '/customers',
    '/inventory',
    '/finance/receivables'
  ];

  const actualPaths = DASHBOARD_QUICK_ACTIONS.map(action => action.path);

  assert.deepStrictEqual(actualPaths, expectedPaths);
  assert.strictEqual(DASHBOARD_QUICK_ACTIONS.length, 5);
});
