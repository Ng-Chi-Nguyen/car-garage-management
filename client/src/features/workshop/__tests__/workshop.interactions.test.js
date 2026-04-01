import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getWorkshopRouteTarget, handleWorkshopAction } from '../workshop.interactions.js';

describe('Workshop Interactions', () => {
    describe('getWorkshopRouteTarget', () => {
        it('should return /intake/new for create_intake', () => {
            assert.equal(getWorkshopRouteTarget('create_intake'), '/intake/new');
        });

        it('should return /repair-orders/new for create_repair_order', () => {
            assert.equal(getWorkshopRouteTarget('create_repair_order'), '/repair-orders/new');
        });

        it('should return /repair-orders?page=1 for view_repair_orders', () => {
            assert.equal(getWorkshopRouteTarget('view_repair_orders'), '/repair-orders?page=1');
        });

        it('should return /repair-orders?page=1 for view_vehicle with context.id', () => {
            assert.equal(getWorkshopRouteTarget('view_vehicle', { id: 'RO-123' }), '/repair-orders?page=1');
        });

        it('should fallback to /repair-orders?page=1 for view_vehicle without context or id', () => {
            assert.equal(getWorkshopRouteTarget('view_vehicle', null), '/repair-orders?page=1');
            assert.equal(getWorkshopRouteTarget('view_vehicle', {}), '/repair-orders?page=1');
            assert.equal(getWorkshopRouteTarget('view_vehicle', { someOtherProp: 'abc' }), '/repair-orders?page=1');
        });

        it('should fallback to /repair-orders?page=1 for unknown action', () => {
            assert.equal(getWorkshopRouteTarget('unknown_action'), '/repair-orders?page=1');
        });
    });

    describe('handleWorkshopAction', () => {
        it('should call navigate with the correct target route', () => {
            let navigatedTo = null;
            const mockNavigate = (path) => {
                navigatedTo = path;
            };

            handleWorkshopAction(mockNavigate, 'create_intake');
            assert.equal(navigatedTo, '/intake/new');

            handleWorkshopAction(mockNavigate, 'view_vehicle', { id: '123' });
            assert.equal(navigatedTo, '/repair-orders?page=1');

            handleWorkshopAction(mockNavigate, 'unknown');
            assert.equal(navigatedTo, '/repair-orders?page=1');
        });
    });
});
