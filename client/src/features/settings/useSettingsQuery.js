import { useQuery } from "@tanstack/react-query";
import { fetchSystemParameters, fetchServicePrices, fetchCarBrands } from "./settings.api";
import { SETTINGS_KEYS } from "./settings.queryKeys";

export function useSystemParametersQuery() {
  return useQuery({
    queryKey: SETTINGS_KEYS.parameters(),
    queryFn: fetchSystemParameters,
  });
}

export function useServicePricesQuery() {
  return useQuery({
    queryKey: SETTINGS_KEYS.servicePrices(),
    queryFn: fetchServicePrices,
  });
}

export function useCarBrandsQuery() {
  return useQuery({
    queryKey: SETTINGS_KEYS.carBrands(),
    queryFn: fetchCarBrands,
  });
}
