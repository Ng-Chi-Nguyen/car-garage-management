import { sanitizeInventoryFilters } from './inventory.filters.js';

export const INVENTORY_KEYS = {
  all: ['inventory'],
  lists: () => [...INVENTORY_KEYS.all, 'list'],
  list: (filters) => [...INVENTORY_KEYS.lists(), sanitizeInventoryFilters(filters)],
  details: () => [...INVENTORY_KEYS.all, 'detail'],
  detail: (id) => [...INVENTORY_KEYS.details(), id],
  stats: () => [...INVENTORY_KEYS.all, 'stats'],
};

export const SUPPLIER_KEYS = {
  all: ['suppliers'],
  lists: () => [...SUPPLIER_KEYS.all, 'list'],
  list: (filters) => [...SUPPLIER_KEYS.lists(), sanitizeInventoryFilters(filters)],
  details: () => [...SUPPLIER_KEYS.all, 'detail'],
  detail: (id) => [...SUPPLIER_KEYS.details(), id],
};
