const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const buildUrl = (path) => (path.startsWith("http") ? path : `${API_BASE_URL}${path}`);

const doFetch = (path, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = { ...(options.headers || {}) };

  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(buildUrl(path), { ...options, headers });
};

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return false;

  try {
    const response = await fetch(buildUrl("/api/auth/refresh"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    return true;
  } catch {
    return false;
  }
};

/**
 * Drop-in replacement for `fetch` that attaches the stored access token and,
 * on a 401 caused by an expired access token, transparently refreshes once
 * and retries. Returns a normal Response either way, so existing call sites
 * (`const data = await response.json(); if (!response.ok) throw ...`) don't
 * need to change their error handling.
 */
export const apiFetch = async (path, options = {}) => {
  const response = await doFetch(path, options);

  if (response.status !== 401) {
    return response;
  }

  const body = await response.clone().json().catch(() => null);
  if (body?.code !== "TOKEN_EXPIRED") {
    return response;
  }

  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth:logout"));
    return response;
  }

  return doFetch(path, options);
};

export default apiFetch;
