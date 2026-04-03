import { test } from 'node:test';
import assert from 'node:assert';
import { handleViewAllRecentOrders } from '../dashboard.interactions.js';

test('clicking "Xem tất cả" navigates to /workshop list route', () => {
  let navigatedPath = null;
  const mockNavigate = (path) => {
    navigatedPath = path;
  };

  handleViewAllRecentOrders(mockNavigate);
  
  // Verify it navigates to the list route, not the /new route
  assert.strictEqual(navigatedPath, '/workshop');
});
