import axiosClient from "../../lib/axiosClient.js";

const unwrap = (response, key) => response.data?.data?.[key];

export async function fetchSystemParameters() {
  const response = await axiosClient.get("/api/v1/settings/parameters");
  return {
    ...unwrap(response, "parameters"),
    lastUpdated: "Đã đồng bộ",
    updatedBy: "Hệ thống",
  };
}

export async function updateSystemParameters(data) {
  const response = await axiosClient.put("/api/v1/settings/parameters", data);
  return unwrap(response, "parameters");
}

export async function fetchServicePrices() {
  const response = await axiosClient.get("/api/v1/settings/service-prices");
  return unwrap(response, "servicePrices");
}

export async function fetchCarBrands() {
  const response = await axiosClient.get("/api/v1/settings/car-brands");
  return unwrap(response, "carBrands");
}
