import axiosClient from "../../lib/axiosClient.js";

const unwrap = (response, key) => response.data?.data?.[key];

export async function fetchAdminUsers(params = {}) {
  const response = await axiosClient.get("/api/v1/admin/users", { params });
  return {
    users: unwrap(response, "users"),
    pagination: unwrap(response, "pagination")
  };
}

export async function updateAdminUser(id, data) {
  const response = await axiosClient.put(`/api/v1/admin/users/${id}`, data);
  return unwrap(response, "user");
}

export async function createAdminUser(data) {
  const response = await axiosClient.post("/api/v1/admin/users", data);
  return unwrap(response, "user");
}

export async function resetPasswordAdminUser(id, data) {
  const response = await axiosClient.post(`/api/v1/admin/users/${Number(id)}/reset-password`, data);
  return unwrap(response, "message");
}
