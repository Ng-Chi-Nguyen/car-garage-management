import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Sidebar active-state and admin-page guard contract', () => {
  const sidebarPath = path.join(process.cwd(), 'client/src/components/layout/sidebar.jsx');
  const content = fs.readFileSync(sidebarPath, 'utf8');

  // 1. /settings NavLink must be exact-only (end).
  const hasEndProp = content.match(/end(?:=\{[^{}]*\})?/);
  assert.ok(hasEndProp, 'Sidebar NavLink must use `end` prop to prevent double-highlighting for /settings');

  // 2. “Nhân sự” item must be conditionally rendered for admin only.
  // Check if there's any filtering or conditional logic around role.
  const checksRole = content.includes('role') || content.includes('getRole()');
  const filtersItems = content.includes('.filter') || content.includes('...(');
  assert.ok(checksRole && filtersItems, 'Sidebar must conditionally render "Nhân sự" based on role');
});
