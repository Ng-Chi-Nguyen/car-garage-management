export const INTAKE_KEYS = {
  all: ["intake"],
  lists: () => [...INTAKE_KEYS.all, "list"],
  details: () => [...INTAKE_KEYS.all, "detail"],
};
