export const INVENTORY_KEYS = {
  all: ['inventory'],
  lists: () => [...INVENTORY_KEYS.all, 'list'],
  list: (filters) => [...INVENTORY_KEYS.lists(), filters],
  details: () => [...INVENTORY_KEYS.all, 'detail'],
  detail: (id) => [...INVENTORY_KEYS.details(), id],
  stats: () => [...INVENTORY_KEYS.all, 'stats'],
};
