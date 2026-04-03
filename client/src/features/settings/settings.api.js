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

export async function createServicePrice(data) {
  const payload = {
    name: data.name?.trim(),
    price: Number(data.price),
  };
  const response = await axiosClient.post("/api/v1/settings/service-prices", payload);
  return unwrap(response, "servicePrice");
}

export async function updateServicePrice({ id, data }) {
  const payload = {
    name: data.name?.trim(),
    price: Number(data.price),
  };
  const response = await axiosClient.put(`/api/v1/settings/service-prices/${Number(id)}`, payload);
  return unwrap(response, "servicePrice");
}

export async function deleteServicePrice(id) {
  const response = await axiosClient.delete(`/api/v1/settings/service-prices/${Number(id)}`);
  return unwrap(response, "result");
}

export async function fetchCarBrands() {
  const response = await axiosClient.get("/api/v1/settings/car-brands");
  return unwrap(response, "carBrands");
}
