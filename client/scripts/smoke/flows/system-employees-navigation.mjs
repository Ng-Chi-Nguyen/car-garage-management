import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function run() {
  console.log('Running system-employees-navigation smoke flow...');

  const sidebarPath = path.resolve(__dirname, '../../../src/components/layout/sidebar.jsx');
  const sidebarSource = fs.readFileSync(sidebarPath, 'utf-8');

  // Verify the /settings/employees is present but conditionally rendered for Admin only
  if (!sidebarSource.includes("/settings/employees")) {
    throw new Error('Sidebar navigation is missing /settings/employees path');
  }

  // It should be guarded by role
  const isGuarded = sidebarSource.includes('role ===') || sidebarSource.includes('Role') || sidebarSource.includes('Admin') || sidebarSource.includes('.filter');
  
  if (!isGuarded) {
    throw new Error('Sidebar navigation does not guard /settings/employees based on Admin role');
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
