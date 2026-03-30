import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const kpiGridPath = path.join(__dirname, '../components/WorkshopKpiGrid.jsx');
const queueTablePath = path.join(__dirname, '../components/WorkshopQueueTable.jsx');

describe('Workshop UI Contracts', () => {
    describe('WorkshopKpiGrid.jsx', () => {
        const content = fs.readFileSync(kpiGridPath, 'utf-8');

        it('does not use 1px divider borders', () => {
            assert.ok(!content.includes('border-t'), 'Should not use border-t');
            assert.ok(!content.includes('border-b'), 'Should not use border-b');
            assert.ok(!content.includes('border-l'), 'Should not use border-l');
            assert.ok(!content.includes('border-r'), 'Should not use border-r');
            assert.ok(!content.includes('divide-y'), 'Should not use divide-y');
        });

        it('uses pulse animation for loading state', () => {
            assert.ok(content.includes('animate-pulse'), 'Should have animate-pulse class');
        });

        it('uses tonal/soft styling for badges/icons', () => {
            assert.ok(content.includes('bg-secondary/10'), 'Should use soft background for badges');
            assert.ok(content.includes('text-secondary'), 'Should use matching text color');
        });
    });

    describe('WorkshopQueueTable.jsx', () => {
        const content = fs.readFileSync(queueTablePath, 'utf-8');

        it('does not use 1px divider borders', () => {
            // Check for traditional table borders
            assert.ok(!content.includes('border-b'), 'Should not use border-b for row separators');
            assert.ok(!content.includes('divide-y'), 'Should not use divide-y');
        });

        it('uses gap for spacing-first rows', () => {
            // Should use flex layout with gap
            assert.ok(content.includes('gap-3') || content.includes('gap-4'), 'Should use gap for spacing');
        });

        it('uses soft-fill status badges dynamically', () => {
            assert.ok(content.includes('bg-primary/10') && content.includes('bg-secondary/10'), 'Should use soft background for badges');
            assert.ok(content.includes('text-primary') && content.includes('text-secondary'), 'Should use dynamic text color');
        });
    });
});
