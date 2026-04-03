import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const panelPath = path.join(__dirname, '../components/WorkshopStatusPanel.jsx');
const panelCode = fs.readFileSync(panelPath, 'utf-8');

test('WorkshopStatusPanel phase2 UI contracts', async (t) => {
  await t.test('has controlled search input in form submit', () => {
    assert.match(panelCode, /<form[^>]*onSubmit=\{[a-zA-Z]+\}[^>]*>/);
    assert.match(panelCode, /updateFilters\(\{ search:/);
  });

  await t.test('has clear/reset action calling exact reset signature', () => {
    assert.match(panelCode, /updateFilters\(\{\s*status:\s*["']all["'],\s*range:\s*["']7d["'],\s*search:\s*["']["'],\s*page:\s*1\s*\}\)/);
  });

  await t.test('metric counts are mapped in tabs', () => {
    assert.match(panelCode, /metricKey:\s*["']total["']/);
    assert.match(panelCode, /metricKey:\s*["']waiting["']/);
    assert.match(panelCode, /metricKey:\s*["']in_progress["']/);
    assert.match(panelCode, /metricKey:\s*["']completed["']/);
    assert.match(panelCode, /metrics\[opt\.metricKey\]/);
  });

  await t.test('active tab has aria-pressed="true" cue', () => {
    assert.match(panelCode, /aria-pressed=\{isActive\}/);
  });
});
