const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

const safeParse = (raw) => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  getUser: () => safeParse(localStorage.getItem(USER_KEY)),
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user ?? null)),
  clearUser: () => localStorage.removeItem(USER_KEY),
  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
