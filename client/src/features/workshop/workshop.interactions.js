export const getWorkshopRouteTarget = (action, context = {}) => {
    switch (action) {
        case 'create_intake':
            return '/intake/new';
        case 'create_repair_order':
            return '/repair-orders/new';
        case 'view_repair_orders':
            return '/repair-orders?page=1';
        case 'view_vehicle':
            // "fallback when row lacks target id/data -> /repair-orders?page=1"
            if (!context || !context.id) {
                return '/repair-orders?page=1';
            }
            return '/vehicles'; // Spec says view_vehicle -> /vehicles literally. Wait, maybe `/vehicles/${context.id}`? Spec just says: "row action view_vehicle -> /vehicles"
        default:
            return '/repair-orders?page=1';
    }
};

export const handleWorkshopAction = (navigate, action, context = {}) => {
    const target = getWorkshopRouteTarget(action, context);
    navigate(target);
};