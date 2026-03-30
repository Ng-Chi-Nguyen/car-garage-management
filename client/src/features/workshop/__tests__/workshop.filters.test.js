import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
    getValidStatus,
    getValidRange,
    getValidSearch,
    getValidPage,
    normalizeFilters,
    applyFilterUpdates
} from '../workshop.filters.js';

describe('workshop filters', () => {
    describe('getValidStatus', () => {
        it('returns valid status unchanged', () => {
            assert.equal(getValidStatus('waiting'), 'waiting');
            assert.equal(getValidStatus('in_progress'), 'in_progress');
            assert.equal(getValidStatus('completed'), 'completed');
            assert.equal(getValidStatus('all'), 'all');
        });

        it('returns "all" for invalid or missing status', () => {
            assert.equal(getValidStatus('invalid'), 'all');
            assert.equal(getValidStatus(''), 'all');
            assert.equal(getValidStatus(null), 'all');
            assert.equal(getValidStatus(undefined), 'all');
            assert.equal(getValidStatus('WAITING'), 'all'); // Case-sensitive by design
        });
    });

    describe('getValidRange', () => {
        it('returns valid range unchanged', () => {
            assert.equal(getValidRange('today'), 'today');
            assert.equal(getValidRange('7d'), '7d');
            assert.equal(getValidRange('30d'), '30d');
            assert.equal(getValidRange('90d'), '90d');
            assert.equal(getValidRange('this_month'), 'this_month');
            assert.equal(getValidRange('all'), 'all');
        });

        it('returns "7d" for invalid or missing range', () => {
            assert.equal(getValidRange('invalid'), '7d');
            assert.equal(getValidRange(''), '7d');
            assert.equal(getValidRange(null), '7d');
            assert.equal(getValidRange(undefined), '7d');
            assert.equal(getValidRange('7D'), '7d');
        });
    });

    describe('getValidSearch', () => {
        it('trims whitespace', () => {
            assert.equal(getValidSearch('  hello  '), 'hello');
        });

        it('returns empty string for missing search', () => {
            assert.equal(getValidSearch(null), '');
            assert.equal(getValidSearch(undefined), '');
            assert.equal(getValidSearch('   '), '');
        });

        it('truncates to 100 characters', () => {
            const longString = 'a'.repeat(150);
            const valid = getValidSearch(longString);
            assert.equal(valid.length, 100);
            assert.equal(valid, 'a'.repeat(100));
        });
    });

    describe('getValidPage', () => {
        it('returns valid page number', () => {
            assert.equal(getValidPage('2'), 2);
            assert.equal(getValidPage(5), 5);
        });

        it('returns 1 for invalid or missing page', () => {
            assert.equal(getValidPage('invalid'), 1);
            assert.equal(getValidPage('-5'), 1);
            assert.equal(getValidPage('0'), 1);
            assert.equal(getValidPage(null), 1);
            assert.equal(getValidPage(undefined), 1);
        });
    });

    describe('normalizeFilters', () => {
        it('cleans up search parameters properly', () => {
            const params = new URLSearchParams('status=invalid&range=30d&search=  foo  &page=2');
            const clean = normalizeFilters(params);
            
            assert.equal(clean.get('status'), null); // 'all' is default, so remove it
            assert.equal(clean.get('range'), '30d');
            assert.equal(clean.get('search'), 'foo');
            assert.equal(clean.get('page'), '2');
        });

        it('removes default parameters', () => {
            const params = new URLSearchParams('status=all&range=7d&search=   ');
            const clean = normalizeFilters(params);
            
            assert.equal(clean.get('status'), null);
            assert.equal(clean.get('range'), null);
            assert.equal(clean.get('search'), null);
        });

        it('query uses URL page contract (reads valid page from URL params)', () => {
            const params = new URLSearchParams('page=5');
            const clean = normalizeFilters(params);
            assert.equal(clean.get('page'), '5');
            
            const paramsDefault = new URLSearchParams('page=1');
            const cleanDefault = normalizeFilters(paramsDefault);
            assert.equal(cleanDefault.get('page'), null); // 1 is default
        });
    });

    describe('applyFilterUpdates', () => {
        it('preserves existing filters when page changes', () => {
            const prev = new URLSearchParams('status=waiting&search=abc&page=1');
            const updated = applyFilterUpdates(prev, { page: 2 });
            
            assert.equal(updated.get('status'), 'waiting');
            assert.equal(updated.get('search'), 'abc');
            assert.equal(updated.get('page'), '2');
        });

        it('resets page to 1 when a filter changes and page is not explicitly set', () => {
            const prev = new URLSearchParams('status=waiting&page=3');
            const updated = applyFilterUpdates(prev, { status: 'in_progress' });
            
            assert.equal(updated.get('status'), 'in_progress');
            assert.equal(updated.get('page'), null); // page 1 is default, so it's removed
        });

        it('does not reset page when filter changes but page is explicitly set', () => {
            const prev = new URLSearchParams('status=waiting&page=3');
            const updated = applyFilterUpdates(prev, { status: 'in_progress', page: 2 });
            
            assert.equal(updated.get('status'), 'in_progress');
            assert.equal(updated.get('page'), '2');
        });
    });
});
