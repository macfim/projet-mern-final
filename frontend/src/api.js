const API_BASE = "/api";

export function getAccessToken() {
  return localStorage.getItem("token");
}

export function setTokens({ accessToken, token }) {
  const tokenValue = token || accessToken;
  if (tokenValue) localStorage.setItem("token", tokenValue);
}

export function clearTokens() {
  localStorage.removeItem("token");
}

export function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getCurrentUser() {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const headers = options.headers || {};
  headers["Content-Type"] = "application/json";

  const token = getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(API_BASE + path, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const message = errorBody.message || "Request failed";
    throw new Error(message);
  }

  return res.json();
}

export const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) =>
    request(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),
};
