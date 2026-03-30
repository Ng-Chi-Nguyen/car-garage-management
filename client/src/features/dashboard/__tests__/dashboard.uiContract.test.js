import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readComponent = (filename) => {
  return fs.readFileSync(path.join(__dirname, '../components', filename), 'utf8');
};

test('UI Contract: DashboardTrendChart', () => {
  const content = readComponent('DashboardTrendChart.jsx');
  
  // chart card action toggle container
  assert.match(content, /<div className="[^"]*bg-gray-100[^"]*p-1[^"]*rounded-lg/);
  // toggle buttons use rounded-md or similar, no sharp corners
  assert.match(content, /rounded-md/);
});

test('UI Contract: KpiCardGrid', () => {
  const content = readComponent('KpiCardGrid.jsx');
  
  // rounded tonal card shell - Bento Metric Cards must use 3xl (1.5rem) or use 2xl/3xl, not sharp
  // The design requires "rounded-3xl" (24px) for cards, or matching SectionCard "rounded-\[28px\]" / "rounded-[24px]"
  assert.match(content, /rounded-(?:2xl|3xl|\[24px\]|\[28px\])/);
  
  // prohibit 1px solid borders
  assert.doesNotMatch(content, /border border-gray-100/);
  assert.doesNotMatch(content, /border-b-4 border-blue-600/); // no opaque structural boundaries if we adhere strictly, or maybe tonal layered
  
  // "Avoid shadows for static cards"
  assert.doesNotMatch(content, /shadow-sm/);
});

test('UI Contract: RecentRepairOrdersTable', () => {
  const content = readComponent('RecentRepairOrdersTable.jsx');
  
  // CTA button semantics for "Xem tất cả"
  // It should be a proper semantic action, like tonal or ghost button.
  assert.match(content, /Xem tất cả/);
  // No standard 1px borders to separate table cells
  assert.doesNotMatch(content, /border-b border-slate-100/);
  assert.doesNotMatch(content, /divide-y\b(?!-0)/); // divide-y also creates 1px borders, but divide-y-0 is okay
});
