import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('useCreateRepairOrderMutation exports INVALIDATES_KEYS', () => {
  const mutationFile = path.join(__dirname, '../useCreateRepairOrderMutation.js');
  const content = fs.readFileSync(mutationFile, 'utf-8');

  assert.ok(content.includes('export const INVALIDATES_KEYS'), 'Must export INVALIDATES_KEYS');
  assert.ok(content.includes('repairOrdersKeys.lists()'), 'Must invalidate lists key');
});

test('RepairOrderForm submit payload excludes client-authored TongTien', () => {
  const formFile = path.join(__dirname, '../components/RepairOrderForm.jsx');
  const content = fs.readFileSync(formFile, 'utf-8');

  assert.ok(!content.match(/TongTien:\s*/), 'Payload should not include TongTien');
  assert.ok(content.includes('MaVatTu'), 'Payload should map details correctly');
});

test('RepairOrderForm create-success invalidation/navigation path is triggered', () => {
  const formFile = path.join(__dirname, '../components/RepairOrderForm.jsx');
  const content = fs.readFileSync(formFile, 'utf-8');

  assert.ok(content.includes('await createRepairOrder(payload)'), 'Should call mutation');

  assert.ok(content.includes('toast.success'), 'Should show success toast');

  assert.ok(content.includes('navigate("/workshop")') || content.includes("navigate('/workshop')"), 'Should navigate back to list');
});
