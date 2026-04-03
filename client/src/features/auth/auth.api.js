import axiosClient from "../../lib/axiosClient.js";

function normalizeApiError(error, fallbackMessage) {
  throw new Error(error?.response?.data?.message || fallbackMessage);
}

export async function login(credentials) {
  try {
    const response = await axiosClient.post("/api/v1/auth/login", {
      Email: credentials.username,
      MatKhau: credentials.password
    });
    return response.data;
  } catch (error) {
    normalizeApiError(error, "Đăng nhập thất bại");
  }
}

export async function forgotPassword(email) {
  try {
    const response = await axiosClient.post("/api/v1/auth/forgot-password", {
      Email: email,
    });
    return response.data;
  } catch (error) {
    normalizeApiError(error, "Gửi yêu cầu thất bại");
  }
}

export async function changePassword(payload) {
  try {
    const response = await axiosClient.post("/api/v1/auth/change-password", payload);
    return response.data;
  } catch (error) {
    normalizeApiError(error, "Đổi mật khẩu thất bại");
  }
}

export async function resetPassword({ token, newPassword, confirmPassword }) {
  try {
    const response = await axiosClient.post("/api/v1/auth/reset-password", {
      Token: token,
      MatKhauMoi: newPassword,
      XacNhanMatKhauMoi: confirmPassword,
    });
    return response.data;
  } catch (error) {
    normalizeApiError(error, "Đặt lại mật khẩu thất bại");
  }
}
