import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('RepairOrderDetail has employee assignment and inline CRUD controls', () => {
  const file = path.join(__dirname, '../components/RepairOrderDetail.jsx');
  const content = fs.readFileSync(file, 'utf-8');
  
  // Verify Header edit controls
  assert.ok(content.includes('useAdminUsersQuery'), 'Must load users for assignment');
  assert.ok(content.includes('updateOrderMutation.mutateAsync'), 'Must call PUT repair order update');
  assert.ok(content.includes('value={editOrderData.MaNV'), 'Must have Employee select');
  assert.ok(content.includes('value={editOrderData.TrangThai}'), 'Must have TrangThai select');
  assert.ok(content.includes('editOrderData.NoiDungLoi'), 'Must have NoiDungLoi input');
  
  // Verify Detail CRUD controls
  assert.ok(content.includes('handleAddDetail'), 'Must have Add row logic');
  assert.ok(content.includes('saveEditRow'), 'Must have Edit row logic');
  assert.ok(content.includes('handleDeleteDetail'), 'Must have Delete row logic');
  assert.ok(content.includes('createDetailMutation.mutateAsync'), 'Must call POST repair order detail');
  assert.ok(content.includes('updateDetailMutation.mutateAsync'), 'Must call PUT repair order detail');
  assert.ok(content.includes('deleteDetailMutation.mutateAsync'), 'Must call DELETE repair order detail');
});
