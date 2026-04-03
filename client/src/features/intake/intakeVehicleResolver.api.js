import axiosClient from "../../lib/axiosClient.js";

export async function resolveVehicleByPlate(BienSo) {
  const response = await axiosClient.get("/api/v1/workflows/intakes/resolve-vehicle", {
    params: { BienSo: String(BienSo).trim() },
  });

  return response.data?.data;
}
