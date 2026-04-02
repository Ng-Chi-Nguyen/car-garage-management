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
  
  // Extract the payload object definition
  const payloadMatch = content.match(/const payload = \{([\s\S]*?)\};/);
  assert.ok(payloadMatch, 'Should find payload definition');
  
  const payloadStr = payloadMatch[1];
  assert.ok(!payloadStr.includes('TongTien'), 'Payload should not include TongTien');
  assert.ok(payloadStr.includes('MaVatTu'), 'Payload should map details correctly');
});

test('RepairOrderForm create-success invalidation/navigation path is triggered', () => {
  const formFile = path.join(__dirname, '../components/RepairOrderForm.jsx');
  const content = fs.readFileSync(formFile, 'utf-8');
  
  // It should await createRepairOrder
  assert.ok(content.includes('await createRepairOrder(payload)'), 'Should call mutation');
  
  // It should show toast on success
  assert.ok(content.includes('toast.success'), 'Should show success toast');
  
  // It should navigate on success
  assert.ok(content.includes('navigate("/repair-orders")') || content.includes("navigate('/repair-orders')"), 'Should navigate back to list');
});
