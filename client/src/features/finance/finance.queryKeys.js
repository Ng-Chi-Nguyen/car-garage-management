export const FINANCE_KEYS = {
  all: ["finance"],
  receivables: (filters) => [...FINANCE_KEYS.all, "receivables", filters].filter(Boolean),
  summary: (filters) => [...FINANCE_KEYS.all, "summary", filters].filter(Boolean),
  settlements: () => [...FINANCE_KEYS.all, "settlements"],
  history: (filters) => [...FINANCE_KEYS.all, "history", filters].filter(Boolean),
};
