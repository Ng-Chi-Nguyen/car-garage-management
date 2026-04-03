export const reportKeys = {
  all: ['reports'],
  inventory: (params) => [...reportKeys.all, 'inventory', params],
  repair: (params) => [...reportKeys.all, 'repair', params],
  revenue: (params) => [...reportKeys.all, 'revenue', params],
};
