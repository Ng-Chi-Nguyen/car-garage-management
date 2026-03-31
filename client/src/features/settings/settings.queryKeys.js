export const SETTINGS_KEYS = {
  all: ["settings"],
  parameters: () => [...SETTINGS_KEYS.all, "parameters"],
  servicePrices: () => [...SETTINGS_KEYS.all, "servicePrices"],
  carBrands: () => [...SETTINGS_KEYS.all, "carBrands"],
};
