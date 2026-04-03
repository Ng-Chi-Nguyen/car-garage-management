export const getWorkshopRouteTarget = (action) => {
  switch (action) {
    case "create_intake":
      return "/intake";
    case "create_repair_order":
      return "/repair-orders/new";
    case "view_repair_orders":
      return "/workshop";
    case "view_vehicle":
      return "/workshop";
    default:
      return "/workshop";
  }
};

export const handleWorkshopAction = (navigate, action) => {
  const target = getWorkshopRouteTarget(action);
  navigate(target);
};
