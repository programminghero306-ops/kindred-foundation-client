const isLocalHost =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);

const fallbackApiUrl = isLocalHost
  ? "http://localhost:5000"
  : "https://kindread-foundation-server.onrender.com";

const API_URL = (import.meta.env.VITE_API_URL || fallbackApiUrl).replace(
  /\/$/,
  ""
);

const TOKEN_KEY = "kindred_token";
const USER_KEY = "kindred_user";

export { API_URL };

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession({ token, user }) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 20000);
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    window.clearTimeout(timeoutId);
  } catch {
    throw new Error(
      isLocalHost
        ? "Cannot reach the local server. Start the backend with npm start on port 5000."
        : "Cannot reach the backend server. Please try again in a moment."
    );
  }

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const error = new Error(
      (data && data.message) || `Request failed (${response.status})`
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  register: (payload) =>
    request("/auth/register", { method: "POST", body: payload }),
  login: (payload) =>
    request("/auth/login", { method: "POST", body: payload }),
  me: async () => {
    const data = await request("/auth/me", { auth: true });
    return data?.user || data;
  },

  getEvents: (limit) =>
    request(limit ? `/events?limit=${limit}` : "/events"),
  getEvent: (id) => request(`/events/${id}`),
  createEvent: (payload) =>
    request("/events", { method: "POST", body: payload, auth: true }),
  updateEvent: (id, payload) =>
    request(`/events/${id}`, { method: "PUT", body: payload, auth: true }),
  deleteEvent: (id) =>
    request(`/events/${id}`, { method: "DELETE", auth: true }),

  joinEvent: (payload) =>
    request("/joined-events", { method: "POST", body: payload, auth: true }),
  getJoinedEvents: () =>
    request("/joined-events", { auth: true }),
  getMyEvents: () =>
    request("/my-events", { auth: true }),
};
