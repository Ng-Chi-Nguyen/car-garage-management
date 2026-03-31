export const repairOrdersKeys = {
  all: ['repair-orders'],
  lists: () => [...repairOrdersKeys.all, 'list'],
  list: (filters) => [...repairOrdersKeys.lists(), { filters }],
  details: () => [...repairOrdersKeys.all, 'detail'],
  detail: (id) => [...repairOrdersKeys.details(), id],
};
