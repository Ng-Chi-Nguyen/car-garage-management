import intakeVehicleCatalog from "./intakeVehicleCatalog.json" with { type: "json" };

export async function fetchIntakeVehicleCatalog() {
  return intakeVehicleCatalog;
}
