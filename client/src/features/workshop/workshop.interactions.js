export const getWorkshopRouteTarget = (action) => {
  switch (action) {
    case "create_intake":
      return "/intake/new";
    case "create_repair_order":
      return "/repair-orders/new";
    case "view_repair_orders":
      return "/repair-orders?page=1";
    case "view_vehicle":
      return "/repair-orders?page=1";
    default:
      return "/repair-orders?page=1";
  }
};

export const handleWorkshopAction = (navigate, action) => {
  const target = getWorkshopRouteTarget(action);
  navigate(target);
};
