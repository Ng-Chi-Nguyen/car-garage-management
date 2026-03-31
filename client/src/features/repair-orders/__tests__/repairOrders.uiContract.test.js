import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const listPath = path.join(__dirname, '../components/RepairOrdersList.jsx');
const formPath = path.join(__dirname, '../components/RepairOrderForm.jsx');

describe('Repair Orders UI Contracts', () => {
    describe('RepairOrdersList.jsx', () => {
        const content = fs.readFileSync(listPath, 'utf-8');

        it('uses semantic colors instead of hardcoded blue/red', () => {
            assert.ok(!content.includes('bg-blue-600'), 'Should not use hardcoded bg-blue-600');
            assert.ok(!content.includes('text-blue-700'), 'Should not use hardcoded text-blue-700');
            assert.ok(content.includes('bg-primary'), 'Should use primary color token');
        });

        it('uses StateShell for state management', () => {
            assert.ok(content.includes('<StateShell'), 'Should use StateShell component');
        });
    });

    describe('RepairOrderForm.jsx', () => {
        const content = fs.readFileSync(formPath, 'utf-8');

        it('uses semantic colors instead of hardcoded ones', () => {
            assert.ok(!content.includes('bg-blue-600'), 'Should not use hardcoded bg-blue-600');
            assert.ok(!content.includes('bg-indigo-50'), 'Should not use hardcoded bg-indigo-50');
            assert.ok(content.includes('bg-primary'), 'Should use primary color token');
            assert.ok(content.includes('bg-secondary/10'), 'Should use secondary color token');
        });

        it('uses semantic surface and border colors', () => {
            assert.ok(!content.includes('bg-white'), 'Should not use bg-white');
            assert.ok(!content.includes('border-slate-200'), 'Should not use border-slate-200');
            assert.ok(content.includes('bg-surface'), 'Should use bg-surface');
            assert.ok(content.includes('border-border'), 'Should use border-border');
        });
    });
});
