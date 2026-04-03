import { useQuery } from "@tanstack/react-query";
import { fetchIntakeVehicleCatalog } from "./intakeVehicleCatalog.api.js";

export function useVehicleCatalogQuery() {
  return useQuery({
    queryKey: ["intake", "vehicleCatalog"],
    queryFn: fetchIntakeVehicleCatalog,
  });
}
