import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { routeManifest } from '../../../src/app/routeManifest.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../../..');
const matrixPath = path.join(
  rootDir,
  '.hive/features/01_recovery-master-pr-main-delta-20260402-010925/context/route-usability-matrix.md'
);

const routeStatus = new Map([
  ['/login', ['working', 'Auth flow wired to backend login endpoint', '']],
  ['/forgot-password', ['working', 'Reset request flow is present in auth pages', '']],
  ['/reset-password', ['working', 'Reset completion flow is present in auth pages', '']],
  ['/dashboard', ['working', 'Core landing page is routed and implemented', '']],
  ['/workshop', ['working', 'Workshop status page exists', '']],
  ['/intake', ['working', 'Vehicle intake page is routed and workflow-backed', '']],
  ['/intake/new', ['working', 'Intake modal page exists for new intake flow', '']],
  ['/repair-orders/new', ['working', 'Repair order creation page is routed and workflow-backed', '']],
  ['/repair-orders', ['working', 'Repair orders list page exists', '']],
  ['/repair-orders/:id', ['working', 'Repair order detail page exists', '']],
  ['/inventory', ['working', 'Inventory page and stock card journey are wired', '']],
  ['/inventory/stock-card', ['working', 'Stock card page exists', '']],
  ['/finance/receivables', ['working', 'Finance receivables page is wired to report data', '']],
  ['/finance/settlement/print', ['working', 'Settlement print page exists', '']],
  ['/customers', ['blocked', 'Customer data layer is mock-only, so list/search is not backend-driven', 'Task 18/19']],
  ['/customers/detail', ['blocked', 'Customer detail depends on the same mock-only customer data layer', 'Task 18/19']],
  ['/customers/analytics', ['intentionally deferred', 'Static placeholder analytics UI is present but not a real backend journey', 'Task 18/19']],
  ['/settings', ['blocked', 'Settings UI depends on mocked API and backend settings/admin route gaps', 'Task 18/19']],
  ['/settings/activity-log', ['working', 'Activity log page is routed and contract-backed', '']],
  ['/admin/users', ['blocked', 'No dedicated backend admin users route is available', 'Task 18/19']],
  ['/reports/finance-debt', ['blocked', 'Manifest points to missing FinanceDebtReport.jsx file', 'Task 18/19']],
  ['/reports/inventory', ['working', 'Inventory report page is routed', '']],
  ['/reports/repair', ['working', 'Repair report page is routed', '']],
  ['/reports/revenue', ['working', 'Revenue report page is routed', '']],
  ['*', ['working', 'Fallback not-found route is routed', '']]
]);

function formatRow(route) {
  const [status, rootCause, owner] = routeStatus.get(route.path) ?? ['blocked', 'Missing route classification', 'Task 18/19'];
  return `| ${route.path} | ${route.componentPath} | ${status} | ${rootCause} | ${owner || '-'} |`;
}

export default async function run() {
  console.log('Running route-matrix smoke flow...');

  const rows = routeManifest.map(formatRow);
  if (rows.length !== routeManifest.length) {
    throw new Error(`Route matrix row count mismatch: ${rows.length} !== ${routeManifest.length}`);
  }

  const unresolved = routeManifest.filter(route => !routeStatus.has(route.path));
  if (unresolved.length > 0) {
    throw new Error(`Missing route classifications for: ${unresolved.map(route => route.path).join(', ')}`);
  }

  const content = [
    '# Route usability matrix',
    '',
    `Route count: ${routeManifest.length}`,
    '',
    '| Route | Component | Status | Root cause | Owner task/reference |',
    '| --- | --- | --- | --- | --- |',
    ...rows,
    ''
  ].join('\n');

  fs.mkdirSync(path.dirname(matrixPath), { recursive: true });
  fs.writeFileSync(matrixPath, content);
}
