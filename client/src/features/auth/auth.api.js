import { authStorage } from "./auth.storage";

async function readJsonSafe(response) {
  const rawBody = await response.text();

  if (!rawBody) {
    return {};
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    throw new Error("Máy chủ trả về phản hồi không hợp lệ. Vui lòng thử lại.");
  }
}

export async function login(credentials) {
  const response = await fetch("/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Email: credentials.username,
      MatKhau: credentials.password
    }),
  });

  const data = await readJsonSafe(response);

  if (!response.ok) {
    throw new Error(data.message || "Đăng nhập thất bại");
  }

  return data;
}

export async function forgotPassword(email) {
  const response = await fetch("/api/v1/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Email: email,
    }),
  });

  const data = await readJsonSafe(response);

  if (!response.ok) {
    throw new Error(data.message || "Gửi yêu cầu thất bại");
  }

  return data;
}

export async function changePassword(payload) {
  const token = authStorage.getToken();
  const response = await fetch("/api/v1/auth/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  });

  const data = await readJsonSafe(response);

  if (!response.ok) {
    throw new Error(data.message || "Đổi mật khẩu thất bại");
  }

  return data;
}

export async function resetPassword({ token, newPassword, confirmPassword }) {
  const response = await fetch("/api/v1/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Token: token,
      MatKhauMoi: newPassword,
      XacNhanMatKhauMoi: confirmPassword,
    }),
  });

  const data = await readJsonSafe(response);

  if (!response.ok) {
    throw new Error(data.message || "Đặt lại mật khẩu thất bại");
  }

  return data;
}
