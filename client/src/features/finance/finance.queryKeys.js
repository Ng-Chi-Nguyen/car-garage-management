export const FINANCE_KEYS = {
  all: ["finance"],
  receivables: () => [...FINANCE_KEYS.all, "receivables"],
  settlements: () => [...FINANCE_KEYS.all, "settlements"],
};
