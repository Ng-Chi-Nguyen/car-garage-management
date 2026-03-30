import { test } from 'node:test';
import assert from 'node:assert';
import { handleQuickActionClick, computeTrendChartHeights } from '../dashboard.interactions.js';

test('invoking action handler requests navigation to target', () => {
  let navigatedPath = null;
  const mockNavigate = (path) => {
    navigatedPath = path;
  };

  handleQuickActionClick(mockNavigate, '/intake/new');
  assert.strictEqual(navigatedPath, '/intake/new');

  handleQuickActionClick(mockNavigate, '/customers');
  assert.strictEqual(navigatedPath, '/customers');
});

test('changing range causes trend series recomputation path to be invoked', () => {
  // Test computation behavior for trend charts
  const revenues7Days = [1000, 2000];
  const heights7Days = computeTrendChartHeights(revenues7Days);
  
  assert.strictEqual(heights7Days.length, 2);
  assert.strictEqual(heights7Days[0], 50); // 1000/2000 * 100
  assert.strictEqual(heights7Days[1], 100); // 2000/2000 * 100
  
  const revenuesMonth = [0, 5000, 1000];
  const heightsMonth = computeTrendChartHeights(revenuesMonth);
  
  assert.strictEqual(heightsMonth.length, 3);
  assert.strictEqual(heightsMonth[0], 5); // 0/5000 * 100 -> min 5
  assert.strictEqual(heightsMonth[1], 100); // 5000/5000 * 100
  assert.strictEqual(heightsMonth[2], 20); // 1000/5000 * 100
  
  const empty = computeTrendChartHeights([]);
  assert.deepStrictEqual(empty, []);
});
