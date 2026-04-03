import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getWorkshopRouteTarget, handleWorkshopAction } from '../workshop.interactions.js';

describe('Workshop Interactions', () => {
    describe('getWorkshopRouteTarget', () => {
        it('should return /intake for create_intake', () => {
            assert.equal(getWorkshopRouteTarget('create_intake'), '/intake');
        });

        it('should return /repair-orders/new for create_repair_order', () => {
            assert.equal(getWorkshopRouteTarget('create_repair_order'), '/repair-orders/new');
        });

        it('should return /workshop for view_repair_orders', () => {
            assert.equal(getWorkshopRouteTarget('view_repair_orders'), '/workshop');
        });

        it('should return /workshop for view_vehicle with context.id', () => {
            assert.equal(getWorkshopRouteTarget('view_vehicle', { id: 'RO-123' }), '/workshop');
        });

        it('should fallback to /workshop for view_vehicle without context or id', () => {
            assert.equal(getWorkshopRouteTarget('view_vehicle', null), '/workshop');
            assert.equal(getWorkshopRouteTarget('view_vehicle', {}), '/workshop');
            assert.equal(getWorkshopRouteTarget('view_vehicle', { someOtherProp: 'abc' }), '/workshop');
        });

        it('should fallback to /workshop for unknown action', () => {
            assert.equal(getWorkshopRouteTarget('unknown_action'), '/workshop');
        });
    });

    describe('handleWorkshopAction', () => {
        it('should call navigate with the correct target route', () => {
            let navigatedTo = null;
            const mockNavigate = (path) => {
                navigatedTo = path;
            };

            handleWorkshopAction(mockNavigate, 'create_intake');
            assert.equal(navigatedTo, '/intake');

            handleWorkshopAction(mockNavigate, 'view_vehicle', { id: '123' });
            assert.equal(navigatedTo, '/workshop');

            handleWorkshopAction(mockNavigate, 'unknown');
            assert.equal(navigatedTo, '/workshop');
        });
    });
});
