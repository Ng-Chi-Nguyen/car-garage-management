import axiosClient from "../../lib/axiosClient.js";

export async function resolveVehicleByPlate(BienSo) {
  // Use the management vehicle list API to get full vehicle details including KhachHang, HieuXe
  const response = await axiosClient.get("/api/v1/vehicles", {
    params: { BienSo: String(BienSo).trim() },
  });

  const vehicles = response.data?.data?.vehicles || [];
  const exactMatch = vehicles.find(v => v.BienSo === String(BienSo).trim());
  
  if (!exactMatch) {
    const error = new Error("Không tìm thấy xe.");
    error.status = 404;
    throw error;
  }

  return exactMatch;
}
