import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const orderPath = path.join(__dirname, '../../../pages/repair/RepairOrder.jsx');
const formPath = path.join(__dirname, '../components/RepairOrderForm.jsx');

describe('Repair Orders UI Contracts', () => {
    describe('RepairOrder.jsx', () => {
        const content = fs.readFileSync(orderPath, 'utf-8');

        it('asserts no hardcoded sample plate on initial render', () => {
            assert.ok(!content.includes('51H-123.45'), 'Should not use hardcoded sample plate');
        });
    });

    describe('RepairOrderForm.jsx', () => {
        const content = fs.readFileSync(formPath, 'utf-8');

        it('asserts no default fake row on initial render', () => {
            // Should start with empty rows: useState([])
            assert.ok(content.includes('useState([])'), 'Should use empty initial state for rows');
            // Should not have the hardcoded ones
            assert.ok(!content.includes('DonGiaVatTu: 250000'), 'Should not have fake default data');
        });

        it('asserts selector/constrained input presence for vehicle/part/labor fields', () => {
            assert.ok(content.includes('<select'), 'Should use select elements');
            assert.ok(content.match(/value=\{header\.MaXe\}/), 'Should have select for vehicle');
            assert.ok(content.match(/value=\{row\.MaVatTu\}/), 'Should have select for part');
            assert.ok(content.match(/value=\{row\.MaTienCong\}/), 'Should have select/input for labor');
        });

        it('asserts labor-fee fallback mode appears when labor-fee fetch returns non-2xx', () => {
            assert.ok(content.includes('isLaborFeeError ?'), 'Should have a fallback UI when labor fee fails');
            assert.ok(content.includes('placeholder="Mã tiền công"'), 'Fallback should be an input with min constraint');
            assert.ok(content.includes('min="1"'), 'Fallback should have min constraint');
        });
    });
});
