export const CUSTOMERS_KEYS = {
  all: ['customers'],
  lists: () => [...CUSTOMERS_KEYS.all, 'list'],
  list: (filters) => [...CUSTOMERS_KEYS.lists(), filters],
  details: () => [...CUSTOMERS_KEYS.all, 'detail'],
  detail: (id) => [...CUSTOMERS_KEYS.details(), id],
  stats: (filters) => [...CUSTOMERS_KEYS.all, 'stats', filters || {}],
};
