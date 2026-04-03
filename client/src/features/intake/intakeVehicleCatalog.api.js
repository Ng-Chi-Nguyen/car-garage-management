import intakeVehicleCatalog from "./intakeVehicleCatalog.json" with { type: "json" };

export async function fetchIntakeVehicleCatalog() {
  try {
    const res = await fetch("/data/car_data.json");
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();

    let rawData = data;
    if (data && typeof data === "object" && !Array.isArray(data) && "brands" in data) {
      rawData = data.brands;
    }

    if (!rawData || typeof rawData !== "object" || Array.isArray(rawData)) {
      throw new Error("Invalid shape");
    }

    const normalized = {};
    for (const [brand, models] of Object.entries(rawData)) {
      const trimmedBrand = brand.trim();
      if (!Array.isArray(models)) continue;
      
      const validModels = [];
      for (const model of models) {
        if (typeof model === "string" && model.trim() !== "") {
          const trimmed = model.trim();
          if (!validModels.includes(trimmed)) {
            validModels.push(trimmed);
          }
        }
      }
      
      if (validModels.length > 0) {
        normalized[trimmedBrand] = validModels;
      }
    }

    if (Object.keys(normalized).length === 0) {
      return intakeVehicleCatalog;
    }

    return normalized;
  } catch (error) {
    return intakeVehicleCatalog;
  }
}
