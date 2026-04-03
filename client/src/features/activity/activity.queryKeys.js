export const ACTIVITY_KEYS = {
  all: ["activity"],
  lists: () => [...ACTIVITY_KEYS.all, "list"],
  list: (filters) => [...ACTIVITY_KEYS.lists(), { filters }],
  stats: (filters) => [...ACTIVITY_KEYS.all, "stats", { filters }],
};
