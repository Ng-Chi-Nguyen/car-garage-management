import fs from 'node:fs/promises';
import path from 'node:path';

import { routeManifest } from '../../../src/app/routeManifest.js';

export default async function run() {
  console.log('Running system-employees-routing smoke flow...');

  const canonicalRoutes = routeManifest.filter(r => r.path === '/settings/employees');
  if (canonicalRoutes.length !== 1) {
    throw new Error(`Expected exactly 1 canonical route for /settings/employees, found ${canonicalRoutes.length}`);
  }

  const canonicalRoute = canonicalRoutes[0];
  if (canonicalRoute.componentPath !== 'src/pages/admin/AdminUsersPage.jsx') {
    throw new Error(`Canonical route must point to src/pages/admin/AdminUsersPage.jsx, found ${canonicalRoute.componentPath}`);
  }

  const legacyRoutes = routeManifest.filter(r => r.path === '/admin/users');
  if (legacyRoutes.length !== 1) {
    throw new Error(`Expected exactly 1 legacy route for /admin/users, found ${legacyRoutes.length}`);
  }

  const legacyRoute = legacyRoutes[0];
  if (legacyRoute.componentPath !== 'src/pages/admin/AdminUsersLegacyRedirect.jsx') {
    throw new Error(`Legacy route must point to src/pages/admin/AdminUsersLegacyRedirect.jsx, found ${legacyRoute.componentPath}`);
  }

  const dupAdminPages = routeManifest.filter(r => r.componentPath === 'src/pages/admin/AdminUsersPage.jsx');
  if (dupAdminPages.length !== 1) {
    throw new Error(`Expected AdminUsersPage.jsx to be mapped exactly once, found ${dupAdminPages.length}`);
  }

  const pageSource = await fs.readFile(path.resolve(process.cwd(), 'src/pages/admin/AdminUsersPage.jsx'), 'utf-8');
  if (pageSource.includes('search: queryParams.search')) {
    throw new Error('AdminUsersPage must not pass search into useAdminUsersQuery');
  }

  console.log('System employees routing constraints passed.');
}
