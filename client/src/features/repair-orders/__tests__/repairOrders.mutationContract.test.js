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