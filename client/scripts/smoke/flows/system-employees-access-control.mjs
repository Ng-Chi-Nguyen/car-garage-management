import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function run() {
  console.log('Running system-employees-access-control smoke flow...');

  const manifestPath = path.resolve(__dirname, '../../../src/app/routeManifest.js');
  const manifestSource = fs.readFileSync(manifestPath, 'utf-8');

  // Verify that the route for /settings/employees has a roles restriction in manifest or router
  const routerPath = path.resolve(__dirname, '../../../src/app/router.jsx');
  const routerSource = fs.readFileSync(routerPath, 'utf-8');

  // One of them must restrict /settings/employees to Admin
  const hasGuard = (manifestSource.includes('roles: [\'Admin\']') && manifestSource.includes('/settings/employees')) || 
                   (routerSource.includes('RoleGuard') && routerSource.includes('/settings/employees'));

  if (!hasGuard) {
    throw new Error('Manifest or router does not guard /settings/employees for Admin role only');
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
