import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getValidRange } from '../dashboard.dateRange.js';
import { DASHBOARD_RANGES, DASHBOARD_DEFAULT_RANGE } from '../dashboard.constants.js';

describe('dashboard.dateRange', () => {
    describe('getValidRange', () => {
        it('returns 7d for invalid range', () => {
            const result = getValidRange('invalid-range');
            assert.strictEqual(result, DASHBOARD_DEFAULT_RANGE);
            assert.strictEqual(result, '7d');
        });

        it('returns 7d for empty range', () => {
            const result = getValidRange('');
            assert.strictEqual(result, DASHBOARD_DEFAULT_RANGE);
        });

        it('returns 7d for null or undefined range', () => {
            assert.strictEqual(getValidRange(null), DASHBOARD_DEFAULT_RANGE);
            assert.strictEqual(getValidRange(undefined), DASHBOARD_DEFAULT_RANGE);
        });

        it('preserves valid ranges', () => {
            assert.strictEqual(getValidRange(DASHBOARD_RANGES.TODAY), DASHBOARD_RANGES.TODAY);
            assert.strictEqual(getValidRange(DASHBOARD_RANGES.LAST_7_DAYS), DASHBOARD_RANGES.LAST_7_DAYS);
            assert.strictEqual(getValidRange(DASHBOARD_RANGES.THIS_MONTH), DASHBOARD_RANGES.THIS_MONTH);
            assert.strictEqual(getValidRange(DASHBOARD_RANGES.ALL_TIME), DASHBOARD_RANGES.ALL_TIME);
        });
    });
});
