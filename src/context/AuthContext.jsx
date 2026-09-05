import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiFetch } from "../api/client";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    const refreshToken = localStorage.getItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    if (refreshToken) {
      // Best-effort revoke; don't block logout on the network call.
      apiFetch("/api/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleAuthLogout = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener("auth:logout", handleAuthLogout);
    return () => window.removeEventListener("auth:logout", handleAuthLogout);
  }, []);

  const verifyToken = useCallback(async () => {
    try {
      const response = await apiFetch("/api/auth/me");

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        logout();
      }
    } catch (error) {
      console.error("Auth verification failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token, verifyToken]);

  const login = (userData, userToken, userRefreshToken) => {
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    if (userRefreshToken) {
      localStorage.setItem("refreshToken", userRefreshToken);
    }
    setToken(userToken);
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
