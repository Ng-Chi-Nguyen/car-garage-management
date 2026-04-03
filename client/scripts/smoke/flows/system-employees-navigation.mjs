import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function run() {
  console.log('Running system-employees-navigation smoke flow...');

  const sidebarPath = path.resolve(__dirname, '../../../src/components/layout/sidebar.jsx');
  const sidebarSource = fs.readFileSync(sidebarPath, 'utf-8');

  // Verify navigation entry exists
  if (!sidebarSource.includes("path: '/settings/employees'")) {
    throw new Error('Sidebar navigation is missing /settings/employees path');
  }

  // Verify icon consistency (badge) and text
  if (!sidebarSource.includes("name: 'Nhân sự'")) {
    // Also allow "Nhân viên"
    if (!sidebarSource.includes("name: 'Nhân viên'")) {
      throw new Error('Sidebar navigation is missing expected name (Nhân sự or Nhân viên) for employees');
    }
  }
}
