import axiosClient from "../../lib/axiosClient.js";

const unwrap = (response, key) => response.data?.data?.[key];

export async function fetchAdminUsers(params = {}) {
  const response = await axiosClient.get("/api/v1/admin/users", { params });
  return unwrap(response, "users");
}

export async function updateAdminUser(id, data) {
  const response = await axiosClient.put(`/api/v1/admin/users/${id}`, data);
  return unwrap(response, "user");
}
