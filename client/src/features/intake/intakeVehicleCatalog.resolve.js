const ALIASES = {
  chevy: "chevrolet",
  mercedes: "mercedes-benz",
  vw: "volkswagen",
};

export function resolveModelsForBrand(catalog, brand, fallbackCatalog) {
  if (!catalog) catalog = {};
  if (!fallbackCatalog) fallbackCatalog = {};
  if (!brand || typeof brand !== "string") return [];

  if (catalog[brand]) return catalog[brand];

  const normalizedSearch = brand.trim().toLowerCase();
  for (const [key, models] of Object.entries(catalog)) {
    if (key.trim().toLowerCase() === normalizedSearch) {
      return models;
    }
  }

  const alias = ALIASES[normalizedSearch];
  if (alias) {
    for (const [key, models] of Object.entries(catalog)) {
      if (key.trim().toLowerCase() === alias) {
        return models;
      }
    }
  }

  if (fallbackCatalog[brand]) return fallbackCatalog[brand];

  for (const [key, models] of Object.entries(fallbackCatalog)) {
    if (key.trim().toLowerCase() === normalizedSearch) {
      return models;
    }
  }

  if (alias) {
    for (const [key, models] of Object.entries(fallbackCatalog)) {
      if (key.trim().toLowerCase() === alias) {
        return models;
      }
    }
  }

  return [];
}
