import axiosClient from "../../lib/axiosClient.js";

export async function createIntake(data) {
  const response = await axiosClient.post("/api/v1/workflows/intakes", data?.intake ? data : { intake: data });
  return response.data;
}

export async function createVehicle(data) {
  const response = await axiosClient.post("/api/v1/vehicles", data);
  return response.data?.data?.vehicle || response.data?.data || response.data;
}

export async function fetchIntakeHistory() {
  const response = await axiosClient.get("/api/v1/workflows/intakes/history");
  return response.data;
}
