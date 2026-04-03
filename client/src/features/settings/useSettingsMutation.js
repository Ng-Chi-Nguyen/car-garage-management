import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createServicePrice,
  deleteServicePrice,
  updateServicePrice,
  updateSystemParameters,
} from "./settings.api.js";
import { SETTINGS_KEYS } from "./settings.queryKeys.js";

export const INVALIDATES_KEYS = {
  updateSystemParameters: [SETTINGS_KEYS.parameters()],
  servicePrices: [SETTINGS_KEYS.servicePrices()],
};

export function useUpdateSystemParametersMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSystemParameters,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: INVALIDATES_KEYS.updateSystemParameters[0],
      });
    },
  });
}

export function useCreateServicePriceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createServicePrice,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: INVALIDATES_KEYS.servicePrices[0],
      });
    },
  });
}

export function useUpdateServicePriceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateServicePrice,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: INVALIDATES_KEYS.servicePrices[0],
      });
    },
  });
}

export function useDeleteServicePriceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteServicePrice,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: INVALIDATES_KEYS.servicePrices[0],
      });
    },
  });
}
