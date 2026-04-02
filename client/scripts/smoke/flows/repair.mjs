import { readFile } from 'node:fs/promises';

export default async function run() {
  const [routeManifest, apiSource, listSource] = await Promise.all([
    readFile(new URL('../../../src/app/routeManifest.js', import.meta.url), 'utf8'),
    readFile(new URL('../../../src/features/repair-orders/repairOrders.api.js', import.meta.url), 'utf8'),
    readFile(new URL('../../../src/features/repair-orders/components/RepairOrdersList.jsx', import.meta.url), 'utf8')
  ]);

  if (!routeManifest.includes('/repair-orders/:id')) {
    throw new Error('repair detail route is missing in routeManifest');
  }

  if (!apiSource.includes('fetchRepairOrderDetails')) {
    throw new Error('fetchRepairOrderDetails API missing');
  }

  if (!listSource.includes('<Link to={`/repair-orders/${row.MaPhieuSC}`}')) {
    throw new Error('RepairOrdersList missing link to detail page');
  }
}
